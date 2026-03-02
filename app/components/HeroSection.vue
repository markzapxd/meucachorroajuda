<template>
  <section class="hero" @click="ensurePlaying">
    <div class="hero-image-container reveal-on-scroll" ref="containerRef">
      <video ref="videoRef" autoplay loop playsinline class="hero-video" @loadedmetadata="onVideoLoad">
        <source src="/images/e.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-text-box">
          <h3 class="hero-subtitle scale-up">PIX</h3>
          <h1 class="hero-title" ref="titleRef">
            <span v-for="(word, i) in titleWords" :key="i" class="word-wrapper">
              <span class="word" :style="{ transitionDelay: `${i * 0.1}s` }">{{ word }}&nbsp;</span>
            </span>
          </h1>
          <div class="btn-container" @mousemove="handleMagnetic" @mouseleave="resetMagnetic" ref="btnContainerRef">
            <NuxtLink to="/ajuda" class="btn-adopt" :style="magneticStyle">
              Ajudar 🐶
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const videoRef = ref(null);
const containerRef = ref(null);
const btnContainerRef = ref(null);
const magneticStyle = ref({ transform: 'translate(0, 0)' });

const titleText = "Ajudem meu cachorro ele esta doente";
const titleWords = computed(() => titleText.split(' '));

const onVideoLoad = () => {
  if (videoRef.value) {
    videoRef.value.muted = false; // Áudio sempre ativado
    videoRef.value.play().catch(e => console.log('Autoplay com áudio bloqueado pelo navegador:', e));
  }
};

const ensurePlaying = () => {
  if (videoRef.value) {
    videoRef.value.muted = false;
    if (videoRef.value.paused) {
      videoRef.value.play().catch(e => console.log('Erro ao tocar áudio:', e));
    }
  }
};

const handleMagnetic = (e) => {
  const btn = btnContainerRef.value;
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const moveX = (e.clientX - centerX) * 0.3;
  const moveY = (e.clientY - centerY) * 0.3;
  
  magneticStyle.value = {
    transform: `translate(${moveX}px, ${moveY}px)`
  };
};

const resetMagnetic = () => {
  magneticStyle.value = {
    transform: 'translate(0, 0)',
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
  };
  setTimeout(() => {
    magneticStyle.value.transition = '';
  }, 500);
};

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  if (containerRef.value) observer.observe(containerRef.value);
});
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
  transform: scale(1.1);
  opacity: 0;
}

.hero-image-container.is-visible {
  transform: scale(1);
  opacity: 1;
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
  overflow: hidden;
}

.word-wrapper {
  display: inline-block;
  overflow: hidden;
  margin-right: -4px;
}

.word {
  display: inline-block;
  transform: translateY(100%);
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero-image-container.is-visible .word {
  transform: translateY(0);
}

.btn-container {
  display: inline-block;
  padding: 20px;
  margin: -20px;
}

.btn-adopt {
  display: inline-block;
  background: var(--primary-color);
  color: #000;
  padding: 16px 40px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 18px;
  transition: background 0.2s ease, box-shadow 0.3s ease;
  will-change: transform;
}

.btn-adopt:hover {
  background: var(--primary-hover);
  box-shadow: 0 10px 30px rgba(0, 150, 136, 0.4);
}

@media (max-width: 992px) {
  .hero-image-container {
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
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

  .hero-title {
    font-size: 32px;
  }
}
</style>
