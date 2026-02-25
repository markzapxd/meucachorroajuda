<script setup>
// No navegador (componentes Vue), usamos o composable useCookie do Nuxt.
// Ele é reativo e funciona tanto no cliente quanto no servidor (SSR).
const myCookie = useCookie('my-cookie-name');

// Para ler: console.log(myCookie.value)
// Para escrever: myCookie.value = 'novo valor'

onMounted(() => {
  console.log('Valor do cookie no navegador:', myCookie.value);
});
</script>

<template>
  <title>Meu Cachorro Ajuda</title>
  <div class="app">
    <AppHeader />
    <main>
      <HeroSection />
      <DetailsSection />
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
}
</style>

