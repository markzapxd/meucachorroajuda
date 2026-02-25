import { ref, onMounted, onUnmounted, nextTick } from 'vue'

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

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return `Hoje às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const formatTimeTiny = (isoString: string) => {
    const date = new Date(isoString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const isCompact = (msg: any, index: number) => {
    if (index === 0 || msg.isSystem) return false
    const prevMsg = messages.value[index - 1]
    if (!prevMsg || prevMsg.isSystem) return false
    const timeDiff = new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()
    return prevMsg.userId === msg.userId && timeDiff < 5 * 60 * 1000
  }

  const getUserColor = (id: string) => {
    const colors = ['#00d2ff', '#3BA55D', '#ED4245', '#FAA61A', '#EB459E', '#9B59B6']
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

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
    if (!text.trim() || isBlocked.value) return { success: false }

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
      return { success: false }
    }
  }

  const initialize = () => {
    if (import.meta.server) return

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
      pollInterval = setInterval(fetchMessages, 4000)
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
    scrollBottom,
    formatTime,
    formatTimeTiny,
    isCompact,
    getUserColor
  }
}
