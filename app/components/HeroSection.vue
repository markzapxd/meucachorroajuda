<template>
  <section class="hero" @click="ensurePlaying">
    <div class="hero-image-container">
      <video ref="videoRef" autoplay loop playsinline class="hero-video" @loadedmetadata="onVideoLoad">
        <source src="/images/e.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-text-box fade-in">
          <h3 class="hero-subtitle">PIX</h3>
          <h1 class="hero-title">
            Ajudem meu cachorro ele esta doente
          </h1>
          <button class="btn-adopt" @click="scrollToDetails">
            Ajudar 🐶
          </button>
        </div>
      </div>
    </div>

    <!-- Audio Control -->
    <button class="audio-control" @click.stop="toggleMute">
      <span v-if="isMuted">🔇 Som Desligado</span>
      <span v-else>🔊 Som Ligado</span>
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const videoRef = ref(null);
const isMuted = ref(true);

const onVideoLoad = () => {
  if (videoRef.value) {
    videoRef.value.muted = true; // Start muted for autoplay
  }
};

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted;
    isMuted.value = videoRef.value.muted;
  }
};

const ensurePlaying = () => {
  if (videoRef.value && videoRef.value.paused) {
    videoRef.value.play();
  }
};

const scrollToDetails = () => {
  const element = document.getElementById('details');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 24px;
}

.hero-image-container {
  position: absolute;
  top: 100px;
  left: 100px;
  right: 100px;
  bottom: 100px;
  border-radius: 40px;
  overflow: hidden;
  z-index: 1;
}

.hero-img, .hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
}

.audio-control {
  position: absolute;
  bottom: 120px;
  right: 120px;
  z-index: 10;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.audio-control:hover {
  background: var(--glass-border);
  transform: scale(1.05);
}

.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding-left: 60px;
}

.hero-text-box {
  max-width: 650px;
}

.hero-subtitle {
  color: var(--primary-color);
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 24px;
  margin-left: 10px;
}

.hero-title {
  font-size: 68px;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
}

.hero-description {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 520px;
}

.btn-adopt {
  background: var(--primary-color);
  color: #000;
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 18px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btn-adopt:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

@media (max-width: 992px) {
  .hero-image-container {
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
  }

  .audio-control {
    bottom: 80px;
    right: 80px;
  }

  .hero-content {
    padding-left: 0;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  
  .hero-title {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 16px;
  }

  .hero-image-container {
    top: 24px;
    left: 24px;
    right: 24px;
    bottom: 24px;
    border-radius: 24px;
  }

  .audio-control {
    bottom: 40px;
    right: 40px;
    font-size: 12px;
    padding: 8px 16px;
  }

  .hero-title {
    font-size: 32px;
  }
  
  .hero-description {
    font-size: 14px;
  }
}
</style>
