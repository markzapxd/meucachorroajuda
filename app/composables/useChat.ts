// app/composables/useChat.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface ChatMessage {
  id: number
  userId: string
  text: string
  timestamp: string
  isSystem?: boolean
}

// Global shared state
const messages = ref<ChatMessage[]>([])
const myUserId = ref('')
const isBlocked = ref(false)
const blockedUntil = ref(0)
let pollInterval: any = null
let blockTimer: any = null
let useCount = 0

export const useChat = () => {
  const scrollContainer = ref<HTMLElement | null>(null)

  const scrollBottom = async () => {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }

  const fetchMessages = async () => {
    try {
      const data: any = await $fetch('/api/chat')
      if (data && data.messages) {
        if (data.messages.length !== messages.value.length) {
          messages.value = data.messages
          await scrollBottom()
        }
      }
    } catch (e) {
      console.error("[useChat] Poll failed:", e)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isBlocked.value) return

    try {
      const response: any = await $fetch('/api/chat', {
        method: 'POST',
        body: { userId: myUserId.value, text: text.trim() }
      })

      if (response.type === 'error') {
        messages.value.push({
          id: Date.now(),
          userId: 'System',
          text: response.message,
          timestamp: new Date().toISOString(),
          isSystem: true
        })
        
        if (response.retryAfter) {
          isBlocked.value = true
          blockedUntil.value = response.retryAfter
          if (blockTimer) clearInterval(blockTimer)
          blockTimer = setInterval(() => {
            blockedUntil.value--
            if (blockedUntil.value <= 0) {
              isBlocked.value = false
              clearInterval(blockTimer)
              blockTimer = null
            }
          }, 1000)
        }
        await scrollBottom()
        return { success: false, message: response.message }
      } else {
        await fetchMessages()
        return { success: true }
      }
    } catch (e) {
      console.error("[useChat] Send failed:", e)
      return { success: false, error: e }
    }
  }

  const initialize = () => {
    if (process.server) return

    // Load User ID
    let storedId = localStorage.getItem('chat_user_id')
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2, 10).toUpperCase()
      localStorage.setItem('chat_user_id', storedId)
    }
    myUserId.value = storedId

    // Static Polling Logic (Shared across all instances)
    useCount++
    if (!pollInterval) {
      console.log("[useChat] Starting shared polling...")
      fetchMessages()
      pollInterval = setInterval(fetchMessages, 4000) // Slightly slower for optimization
    }
  }

  const cleanup = () => {
    useCount--
    if (useCount <= 0 && pollInterval) {
      console.log("[useChat] Stopping shared polling...")
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  return {
    messages,
    myUserId,
    isBlocked,
    blockedUntil,
    scrollContainer,
    sendMessage,
    initialize,
    cleanup,
    scrollBottom
  }
}
