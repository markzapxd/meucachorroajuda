<template>
  <header class="header">
    <div class="container-fluid header-inner">
      <div class="logo">
        <span class="logo-icon">🐾</span>
        <span class="logo-text">meucachorroajuda</span>
      </div>

      <nav class="nav">
        <NuxtLink to="/" class="nav-link" active-class="active">Home</NuxtLink>
        <NuxtLink to="/ajuda" class="nav-link" active-class="active">Ajuda</NuxtLink>
      </nav>

      <div class="actions">
        <NuxtLink to="/chat" class="btn-try">
          Chat
        </NuxtLink>
        <button class="menu-btn">
          <div class="menu-icon"></div>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: 16px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(13, 13, 13, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
}

.header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 20px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
}

.nav {
  display: flex;
  gap: 32px;
  background: var(--glass-bg);
  padding: 12px 32px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  justify-self: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.nav-link.active, .nav-link:hover {
  color: var(--text-main);
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-self: end;
}

.btn-try {
  background: var(--primary-color);
  color: #000;
  padding: 12px 24px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btn-try:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.theme-toggle {
  color: var(--text-muted);
  font-size: 18px;
  padding: 8px;
}

.menu-btn {
  background: var(--primary-color);
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 18px;
  height: 2px;
  background: #000;
  position: relative;
}

.menu-icon::before, .menu-icon::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 2px;
  background: #000;
  left: 0;
}

.menu-icon::before { top: -6px; }
.menu-icon::after { bottom: -6px; }

@media (max-width: 992px) {
  .header-inner {
    grid-template-columns: 1fr auto;
    padding: 0 24px;
  }
  .nav {
    display: none;
  }
}
</style>
