<template>
  <section id="details" class="details-section">
    <div class="container">
      <h2 class="section-title reveal-on-scroll" ref="titleRef">Nossa Jornada</h2>
      <div class="cards-grid">
        <!-- Card 1 -->
        <div 
          class="story-card reveal-on-scroll" 
          ref="card1Ref"
          @mousemove="handleTilt($event, 'card1')"
          @mouseleave="resetTilt('card1')"
          :style="tiltStyles.card1"
        >
          <div class="card-image">
            <img src="/images/ilustracao-de-cachorro-triste-fofo-sob-o-cobertor-ao-ar-livre-ai_564714-2042.avif" alt="Cachorro doente" />
          </div>
          <div class="card-content">
            <h3>Situação Crítica</h3>
            <p>Meu cachorro está muito mal e precisa de ajuda urgente para o tratamento.</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div 
          class="story-card reveal-on-scroll" 
          ref="card2Ref"
          @mousemove="handleTilt($event, 'card2')"
          @mouseleave="resetTilt('card2')"
          :style="tiltStyles.card2"
        >
          <div class="card-image">
            <img src="/images/story-2.png" alt="Cachorro transsexual" />
          </div>
          <div class="card-content">
            <h3>Identidade Especial</h3>
            <p>Ele é um cachorro transsexual e está passando por complicações delicadas.</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div 
          class="story-card reveal-on-scroll" 
          ref="card3Ref"
          @mousemove="handleTilt($event, 'card3')"
          @mouseleave="resetTilt('card3')"
          :style="tiltStyles.card3"
        >
          <div class="card-image">
            <img src="/images/story-3.png" alt="Namorada preucupada" />
          </div>
          <div class="card-content">
            <h3>Família Preocupada</h3>
            <p>Aqui sua melhor amiga, que está muito preucupada com ele e nos ajuda a cuidar.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const titleRef = ref(null);
const card1Ref = ref(null);
const card2Ref = ref(null);
const card3Ref = ref(null);

const tiltStyles = reactive({
  card1: {},
  card2: {},
  card3: {}
});

const handleTilt = (e, cardKey) => {
  const card = {
    card1: card1Ref.value,
    card2: card2Ref.value,
    card3: card3Ref.value
  }[cardKey];

  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const xc = rect.width / 2;
  const yc = rect.height / 2;
  
  const dx = x - xc;
  const dy = y - yc;
  
  const tiltX = (dy / yc) * -10;
  const tiltY = (dx / xc) * 10;
  
  tiltStyles[cardKey] = {
    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
    transition: 'none'
  };
};

const resetTilt = (cardKey) => {
  tiltStyles[cardKey] = {
    transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'all 0.5s ease'
  };
};

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  [titleRef, card1Ref, card2Ref, card3Ref].forEach(ref => {
    if (ref.value) observer.observe(ref.value);
  });
});
</script>

<style scoped>
.details-section {
  padding: 100px 0 300px 0;
  background-color: var(--bg-color);
}

.section-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 60px;
  font-weight: 800;
  color: var(--primary-color);
  transform: translateY(30px);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.story-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  transform: translateY(50px);
  transform-style: preserve-3d;
}

.story-card.is-visible {
  transform: translateY(0);
}

.story-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--primary-color);
}

.card-image {
  height: 250px;
  overflow: hidden;
  transform: translateZ(20px);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-content {
  padding: 24px;
  transform: translateZ(30px);
}

.card-content h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.card-content p {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .details-section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 28px;
    margin-bottom: 40px;
  }
}
</style>
