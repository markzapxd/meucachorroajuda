<template>
  <div class="chat-widget-container" :class="{ 'is-open': isOpen }">
    <!-- Brand-style Floating Toggle Button -->
    <button class="chat-toggle" @click="toggleChat" :aria-label="isOpen ? 'Fechar Chat' : 'Abrir Chat'">
      <div v-if="!isOpen" class="msg-icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.2L4,17.2V4h16V16z"/>
        </svg>
      </div>
      <div v-else class="close-icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </div>
    </button>

    <!-- Palette-aligned Chat Window -->
    <div v-if="isOpen" class="discord-popout">
      <div class="popout-header">
        <div class="header-content">
          <span class="header-hashtag">#</span>
          <h3>Chat</h3>
        </div>
      </div>

      <div class="popout-messages" ref="messageContainer">
        <div 
          v-for="(msg, index) in messages" 
          :key="msg.id" 
          class="msg-entry"
          :class="{ 'entry-compact': isCompact(msg, index) }"
        >
          <!-- Message with Header -->
          <div v-if="!isCompact(msg, index)" class="entry-full">
            <div class="entry-avatar" :style="{ backgroundColor: getUserColor(msg.userId) }">
              {{ msg.userId.slice(0, 2) }}
            </div>
            <div class="entry-main">
              <div class="entry-header">
                <span class="entry-user" :style="{ color: getUserColor(msg.userId) }">
                   {{ msg.userId === myUserId ? 'Marcelo' : 'User ' + msg.userId }}
                </span>
                <span class="entry-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <p class="entry-text">{{ msg.text }}</p>
            </div>
          </div>

          <!-- Compact Entry -->
          <div v-else class="entry-item-compact">
            <span class="entry-time-compact">{{ formatTimeTiny(msg.timestamp) }}</span>
            <p class="entry-text">{{ msg.text }}</p>
          </div>
        </div>
        <div v-if="messages.length === 0" class="entry-empty">
          <p>diga oi</p>
        </div>
      </div>

      <div class="popout-footer">
        <div class="input-box">
          <input 
            v-model="inputMessage" 
            @keyup.enter="sendMessage" 
            placeholder="Conversar em #chat" 
            maxlength="100"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref<{ id: number; userId: string; text: string; timestamp: string }[]>([])
const messageContainer = ref<HTMLElement | null>(null)
const myUserId = ref('')
let socket: WebSocket | null = null

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

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
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const scrollBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const sendMessage = () => {
  if (!inputMessage.value.trim() || !socket) return
  socket.send(JSON.stringify({ userId: myUserId.value, text: inputMessage.value.trim() }))
  inputMessage.value = ''
}

const connectWS = () => {
  const isSecure = window.location.protocol === 'https:'
  const url = `${isSecure ? 'wss:' : 'ws:'}//${window.location.host}/api/chat?userId=${myUserId.value}`
  socket = new WebSocket(url)
  socket.onmessage = (event) => {
    console.log("[ChatWidget] Message received:", event.data)
    try {
      const payload = JSON.parse(event.data)
      
      if (payload.type === 'history') {
        messages.value = payload.messages
      } else if (payload.type === 'message') {
        messages.value.push(payload.data)
      }
      
      scrollBottom()
    } catch (e) {
      console.error("[ChatWidget] Parse failed", e)
    }
  }
  socket.onclose = () => setTimeout(connectWS, 3000)
}

onMounted(() => {
  let storedId = localStorage.getItem('chat_user_id')
  if (!storedId) {
    storedId = Math.random().toString(36).substring(2, 10).toUpperCase()
    localStorage.setItem('chat_user_id', storedId)
  }
  myUserId.value = storedId
  connectWS()
})

onUnmounted(() => { if (socket) socket.close() })
watch(isOpen, (newVal) => { if (newVal) scrollBottom() })
</script>

<style scoped>
.chat-widget-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: 'Outfit', sans-serif;
}

.chat-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #00d2ff;
  border: none;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
  transition: all 0.2s ease;
}

.chat-toggle:hover {
  transform: scale(1.05);
  background-color: #00b8e6;
}

.discord-popout {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 320px;
  height: 500px;
  background: #0d0d0d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: discord-appear 0.2s ease-out;
}

@keyframes discord-appear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.popout-header {
  background: #1a1a1a;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-hashtag {
  color: #80848e;
  font-size: 18px;
  font-weight: 500;
}

.popout-header h3 {
  color: #f2f3f5;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.popout-messages {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
  background: #0d0d0d;
}

.msg-entry {
  padding: 2px 16px;
  transition: background 0.1s;
}

.msg-entry:hover {
  background: rgba(255, 255, 255, 0.02);
}

.entry-full {
  display: flex;
  gap: 12px;
}

.entry-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  margin-top: 2px;
}

.entry-main {
  flex: 1;
}

.entry-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.entry-user {
  font-weight: 600;
  font-size: 14px;
}

.entry-time {
  font-size: 10px;
  color: #949ba4;
}

.entry-text {
  margin: 0;
  color: #dbdee1;
  font-size: 14px;
  line-height: 1.3;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.entry-item-compact {
  padding-left: 44px;
  position: relative;
}

.entry-time-compact {
  position: absolute;
  left: 0;
  width: 44px;
  text-align: center;
  font-size: 9px;
  color: #949ba4;
  opacity: 0;
  margin-top: 2px;
}

.entry-item-compact:hover .entry-time-compact {
  opacity: 1;
}

.entry-empty {
  text-align: center;
  color: #80848e;
  padding: 20px;
}

.popout-footer {
  padding: 0 16px 16px 16px;
}

.input-box {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 0 12px;
}

.input-box input {
  width: 100%;
  background: none;
  border: none;
  color: #dbdee1;
  font-size: 14px;
  padding: 10px 0;
  outline: none;
}

/* Scrollbar */
.popout-messages::-webkit-scrollbar {
  width: 4px;
}
.popout-messages::-webkit-scrollbar-thumb {
  background: #1a1a1a;
  border-radius: 4px;
}
</style>
