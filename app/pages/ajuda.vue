<template>
  <div class="ajuda-page" @click="ensurePlaying">
    <video ref="bgVideoRef" autoplay loop playsinline class="bg-video">
      <source src="/images/isagi.mp4" type="video/mp4" />
    </video>
    <div class="glass-card fade-in">
      <div class="avatar-section">
        <!-- Taunt Message moved here -->
        <Transition name="fade">
          <div v-if="showTaunt" class="taunt-bubble">
            tenta me pegar otario
          </div>
        </Transition>

        <div class="avatar-container">
          <img 
            src="/images/isagi.gif" 
            alt="Isagi Yoichi" 
            class="avatar-img"
          />
        </div>
      </div>
      
      <div class="button-wrapper">
        <!-- Puzzle Pieces Particles -->
        <div 
          v-for="puzzle in puzzles" 
          :key="puzzle.id" 
          class="puzzle-piece"
          :style="puzzle.style"
        ></div>

        <!-- Teleport Ghosts -->
        <div 
          v-for="ghost in ghosts" 
          :key="ghost.id"
          class="flee-button ghost"
          :style="ghost.style"
        >
          AJUDAR
        </div>

        <a 
          href="https://www.youtube.com/watch?v=iik25wqIuFo&list=RDiik25wqIuFo&start_radio=1" 
          target="_blank" 
          class="flee-button"
          :class="{ 'meta-vision': fleeCount >= 12, 'trembling': fleeCount > 0 && fleeCount < 12, 'not-clickable': clickBlocked }"
          :style="buttonPos"
          @mouseenter="handleHover"
          @click="(e) => { if (clickBlocked) e.preventDefault() }"
        >
          AJUDAR
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'

definePageMeta({
  layout: false
})

const bgVideoRef = ref<HTMLVideoElement | null>(null)

const ensurePlaying = () => {
  if (bgVideoRef.value) {
    bgVideoRef.value.muted = false;
    if (bgVideoRef.value.paused) {
      bgVideoRef.value.play().catch(e => console.log('Erro ao tocar áudio:', e));
    }
  }
}

onMounted(() => {
  if (bgVideoRef.value) {
    bgVideoRef.value.muted = false;
    bgVideoRef.value.play().catch(e => console.log('Autoplay com áudio bloqueado pelo navegador:', e));
  }
})

const fleeCount = ref(0)
const showTaunt = ref(false)
const clickBlocked = ref(true) // Blocked by default
const buttonPos = ref({ 
  transform: 'translate(0, 0)',
  '--current-transform': 'translate(0, 0)'
})

interface Ghost {
  id: number;
  style: any;
}
const ghosts = ref<Ghost[]>([])

interface Puzzle {
  id: number;
  style: any;
}
const puzzles = ref<Puzzle[]>([])
let puzzleIdCounter = 0
let puzzleInterval: any = null

const spawnPuzzle = () => {
  if (fleeCount.value < 12) return
  
  const id = puzzleIdCounter++
  // Focus spawn on the top-left area of the button
  const left = 20 + (Math.random() - 0.5) * 30 
  const top = 20 + (Math.random() - 0.5) * 30
  // Drift more towards the top-left
  const driftX = -100 - Math.random() * 200 // Always drifting left
  const rotate = (Math.random() - 0.5) * 40
  
  puzzles.value.push({
    id,
    style: {
      left: `${left}%`,
      top: `${top}%`,
      '--drift-x': `${driftX}px`,
      '--rotate-start': `${rotate}deg`,
      '--rotate-end': `${rotate + (Math.random() > 0.5 ? 20 : -20)}deg`
    }
  })

  setTimeout(() => {
    puzzles.value = puzzles.value.filter(p => p.id !== id)
  }, 3000)
}

const handleHover = () => {
  if (fleeCount.value === 0) {
    showTaunt.value = true
    setTimeout(() => {
      showTaunt.value = false
    }, 2500)
  }

  if (fleeCount.value < 12) {
    // Save current position as a ghost before moving
    const currentId = Date.now()
    ghosts.value.push({
      id: currentId,
      style: { ...buttonPos.value }
    })

    // Remove ghost after 400ms (matching animation duration)
    setTimeout(() => {
      ghosts.value = ghosts.value.filter(g => g.id !== currentId)
    }, 400)

    // Teleport to new position
    let transform = ''
    if (fleeCount.value === 11) {
      transform = 'translate(0, 0)'
    } else {
      const x = (Math.random() - 0.5) * 450
      const y = (Math.random() - 0.5) * 450
      transform = `translate(${x}px, ${y}px)`
    }

    buttonPos.value = { 
      transform,
      '--current-transform': transform
    }
    fleeCount.value++

    if (fleeCount.value === 12) {
      puzzleInterval = setInterval(spawnPuzzle, 100)
      // Small delay after reaching center before allowing the click
      setTimeout(() => {
        clickBlocked.value = false
      }, 500)
    }
  }
}

onUnmounted(() => {
  if (puzzleInterval) clearInterval(puzzleInterval)
})
</script>

<style scoped>
.ajuda-page {
  position: relative;
  min-height: 100vh;
  background-color: #0d0d0d;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 24px 24px 24px;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  z-index: 0;
  opacity: 0.4;
}

.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(156, 64, 64, 0.1);
  border-radius: 40px;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 100%;
}

.avatar-section {
  position: relative;
  display: flex;
  justify-content: center;
}

.avatar-container {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #00d2ff;
  box-shadow: 0 0 30px rgba(0, 210, 255, 0.3);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-wrapper {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flee-button {
  background: #00d2ff;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: transform 0.05s linear, opacity 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
  cursor: pointer;
  z-index: 10;
  position: absolute;
}

.not-clickable {
  cursor: default;
}

.ghost {
  opacity: 0.6;
  pointer-events: none;
  z-index: 5;
  filter: blur(1px) grayscale(50%) brightness(1.5);
  animation: ghost-fade 0.4s forwards;
  box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
}

@keyframes ghost-fade {
  from { opacity: 0.6; transform: var(--current-transform) scale(1); }
  to { opacity: 0; transform: var(--current-transform) scale(1.2); filter: blur(10px); }
}

.trembling {
  animation: tremble 0.05s infinite;
}

@keyframes tremble {
  0% { transform: var(--current-transform) translateY(1px); }
  25% { transform: var(--current-transform) translateY(-2px); }
  50% { transform: var(--current-transform) translateY(2px); }
  75% { transform: var(--current-transform) translateY(-1px); }
  100% { transform: var(--current-transform) translateY(1px); }
}

/* Meta Vision Aura Effect - BLUE GOD MODE - REFINED */
.meta-vision {
  background: #008cff !important;
  color: #fff !important;
  border-color: #00d2ff !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  z-index: 20;
  box-shadow: inset 0 0 10px #fff;
  animation: isagi-glow-blue 0.1s infinite alternate;
}

/* Puzzle Piece Styling - Now with its own aura */
.puzzle-piece {
  position: absolute;
  width: 20px;
  height: 20px;
  background-image: url('/images/puzzle-piece.svg');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  pointer-events: none;
  z-index: 15;
  filter: drop-shadow(0 0 8px #00d2ff); /* Stronger glow for aura effect */
  animation: puzzle-float 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.puzzle-piece::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: radial-gradient(circle, rgba(0, 210, 255, 0.4) 0%, transparent 70%);
  z-index: -1;
  border-radius: 50%;
  animation: puzzle-aura-pulse 1s infinite alternate;
}

@keyframes puzzle-aura-pulse {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 0.7; transform: scale(1.2); }
}

@keyframes puzzle-float {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(var(--rotate-start)) translate(0, 0);
  }
  20% {
    opacity: 1;
    transform: scale(1) rotate(var(--rotate-start)) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0.7) rotate(var(--rotate-end)) translate(var(--drift-x), -300px);
  }
}

@keyframes isagi-glow-blue {
  0% { filter: brightness(1) contrast(1.1); }
  100% { filter: brightness(1.3) contrast(1.2); transform: var(--current-transform) scale(1.01); }
}

.taunt-bubble {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #000;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  z-index: 100;
  pointer-events: none;
  white-space: nowrap;
}

.taunt-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 480px) {
  .glass-card {
    padding: 40px 24px;
  }
  
  .avatar-container {
    width: 140px;
    height: 140px;
  }
}
</style>
