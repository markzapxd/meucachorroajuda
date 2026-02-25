<template>
  <section id="details" class="details-section">
    <div class="container">
      <h2 class="section-title fade-in">Nossa Jornada</h2>
      <div class="cards-grid">
        <!-- Card 1 -->
        <div class="story-card fade-in" style="animation-delay: 0.1s">
          <div class="card-image">
            <img src="/images/orelhakirk.webp" alt="Cachorro doente" />
          </div>
          <div class="card-content">
            <h3>Situação Crítica</h3>
            <p>Meu cachorro está muito mal e precisa de ajuda urgente para o tratamento.</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="story-card fade-in" style="animation-delay: 0.2s">
          <div class="card-image">
            <img src="/images/story-2.png" alt="Cachorro transsexual" />
          </div>
          <div class="card-content">
            <h3>Identidade Especial</h3>
            <p>Ele é um cachorro transsexual e está passando por complicações delicadas.</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="story-card fade-in" style="animation-delay: 0.3s">
          <div class="card-image">
            <img src="/images/story-3.png" alt="Namorada preucupada" />
          </div>
          <div class="card-content">
            <h3>Família Preocupada</h3>
            <p>Aqui sua namorada, que está muito preucupada com ele e nos ajuda a cuidar.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.story-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--primary-color);
}

.card-image {
  height: 250px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.story-card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  padding: 24px;
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
