<template>
  <div class="discord-page">
    <div class="discord-container">
      <!-- Top Header (Simplified) -->
      <header class="discord-header">
        <div class="header-left">
          <span class="channel-hashtag">#</span>
          <span class="channel-name">chat</span>
        </div>
      </header>

      <!-- Message Area -->
      <main class="discord-main">
        <div class="message-list" ref="messageContainer">
          <div 
            v-for="(msg, index) in messages" 
            :key="msg.id" 
            class="message-group"
            :class="{ 'compact': isCompact(msg, index) }"
          >
            <!-- Normal Message with Avatar -->
            <div v-if="!isCompact(msg, index)" class="message-full">
              <div class="user-avatar" :style="{ backgroundColor: getUserColor(msg.userId) }">
                <span>{{ msg.userId.slice(0, 2) }}</span>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="user-nickname" :style="{ color: getUserColor(msg.userId) }">
                    {{ msg.userId === myUserId ? 'Marcelo' : 'User ' + msg.userId }}
                  </span>
                  <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <div class="message-text">
                  <p>{{ msg.text }}</p>
                </div>
              </div>
            </div>

            <!-- Compact Message (Same User) -->
            <div v-else class="message-item compact">
              <span class="timestamp-compact">{{ formatTimeTiny(msg.timestamp) }}</span>
              <div class="message-text">
                <p>{{ msg.text }}</p>
              </div>
            </div>
          </div>

          <div v-if="messages.length === 0" class="welcome-section">
            <div class="hashtag-circle">#</div>
            <h1>Bem-vindo ao chat!</h1>
            <p>Este é o início do canal.</p>
          </div>
        </div>

        <!-- Input Bar (Simplified) -->
        <div class="discord-input-container">
          <div class="input-wrapper">
            <input 
              v-model="inputMessage" 
              @keyup.enter="sendMessage"
              :placeholder="isBlocked ? 'Aguarde ' + blockedUntil + 's...' : 'Conversar em #chat'" 
              maxlength="100"
              :disabled="isBlocked"
            />
            <button class="send-button" @click="sendMessage" :disabled="!inputMessage.trim() || isBlocked">
              {{ isBlocked ? blockedUntil + 's' : 'Enviar' }}
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({
  layout: false
})

const myUserId = ref('')
const inputMessage = ref('')
const messages = ref<{ id: number; userId: string; text: string; timestamp: string, isSystem?: boolean }[]>([])
const messageContainer = ref<HTMLElement | null>(null)
const isBlocked = ref(false)
const blockedUntil = ref(0)
let pollInterval: any = null
let blockTimer: any = null

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return `Hoje às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatTimeTiny = (isoString: string) => {
  const date = new Date(isoString)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const isCompact = (msg: any, index: number) => {
  if (index === 0) return false
  const prevMsg = messages.value[index - 1]
  if (!prevMsg) return false
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
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const fetchMessages = async () => {
  try {
    const data: any = await $fetch('/api/chat')
    if (data && data.messages) {
      // Only update if message count changed to avoid unnecessary re-renders
      if (data.messages.length !== messages.value.length) {
        messages.value = data.messages
        scrollBottom()
      }
    }
  } catch (e) {
    console.error("[ChatPage] Poll failed:", e)
  }
}

const sendMessage = async () => {
  const text = inputMessage.value.trim()
  if (!text || isBlocked.value) return
  
  const originalText = inputMessage.value
  inputMessage.value = '' // Optimistic clear

  try {
    const response: any = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        userId: myUserId.value,
        text
      }
    })
    
    if (response.type === 'error') {
      // If error (like spam limit), show a system message and restore input
      messages.value.push({
        id: Date.now(),
        userId: 'System',
        text: response.message,
        timestamp: new Date().toISOString(),
        isSystem: true
      })
      inputMessage.value = originalText
      
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
      
      scrollBottom()
    } else {
      // Fetch immediately to show the new message
      fetchMessages()
    }
  } catch (e) {
    console.error("[ChatPage] Send failed:", e)
    inputMessage.value = originalText
  }
}

onMounted(() => {
  let storedId = localStorage.getItem('chat_user_id')
  if (!storedId) {
    storedId = Math.random().toString(36).substring(2, 10).toUpperCase()
    localStorage.setItem('chat_user_id', storedId)
  }
  myUserId.value = storedId
  
  // Initial fetch
  fetchMessages()
  
  // Start polling every 3 seconds
  pollInterval = setInterval(fetchMessages, 3000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
.discord-page {
  height: 100vh;
  background-color: #0d0d0d;
  color: #dbdee1;
  font-family: 'Outfit', sans-serif;
  display: flex;
  justify-content: center;
  padding-top: 80px; /* Space for the site header */
}

.discord-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: #0d0d0d;
}

/* Header */
.discord-header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
  background: #0d0d0d;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.channel-hashtag {
  color: #80848e;
  font-size: 20px;
  font-weight: 500;
}

.channel-name {
  font-weight: 600;
  font-size: 16px;
  color: #f2f3f5;
}

/* Main Content */
.discord-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

/* Welcome */
.welcome-section {
  padding: 48px 16px 16px 16px;
}

.hashtag-circle {
  width: 68px;
  height: 68px;
  background-color: #1a1a1a;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.welcome-section h1 {
  font-size: 32px;
  font-weight: 700;
  color: #f2f3f5;
  margin: 0;
}

.welcome-section p {
  color: #b5bac1;
  margin-top: 4px;
}

/* Message Styles */
.message-group {
  margin-top: 17px;
  padding: 2px 16px;
  transition: background 0.1s;
}

.message-group:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.message-group.compact {
  margin-top: -2px;
}

.message-full {
  display: flex;
  gap: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  margin-top: 2px;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.user-nickname {
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}

.user-nickname:hover {
  text-decoration: underline;
}

.timestamp {
  font-size: 12px;
  color: #949ba4;
}

.message-text {
  color: #dbdee1;
  font-size: 16px;
  line-height: 1.375;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.message-text p {
  margin: 0;
}

/* Compact style */
.message-item.compact {
  display: flex;
  padding-left: 56px;
  position: relative;
}

.timestamp-compact {
  position: absolute;
  left: 0;
  width: 56px;
  text-align: center;
  font-size: 11px;
  color: #949ba4;
  opacity: 0;
  margin-top: 4px;
}

.message-group.compact:hover .timestamp-compact {
  opacity: 1;
}

/* Input container */
.discord-input-container {
  padding: 0 16px 24px 16px;
}

.input-wrapper {
  background-color: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  min-height: 44px;
}

.input-wrapper input {
  flex: 1;
  background: none;
  border: none;
  color: #dbdee1;
  font-size: 16px;
  outline: none;
  padding: 11px 0;
}

.send-button {
  background-color: #00d2ff;
  color: #000;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button:hover:not(:disabled) {
  opacity: 0.9;
}

/* Scrollbar */
.message-list::-webkit-scrollbar {
  width: 8px;
}
.message-list::-webkit-scrollbar-track {
  background: transparent;
}
.message-list::-webkit-scrollbar-thumb {
  background: #1e1f22;
  border-radius: 4px;
}
</style>
