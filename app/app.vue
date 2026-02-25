<script setup lang="ts">
import html2canvas from 'html2canvas';

// No navegador (componentes Vue), usamos o composable useCookie do Nuxt.
const myCookie = useCookie('my-cookie-name');

const takeScreenshot = async () => {
  try {
    const canvas = await html2canvas(document.body);
    const imgData = canvas.toDataURL('image/png');
    console.log('Screenshot captured:', imgData);
    alert('Screenshot captured! Check the console.');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  }
};

const getCookiesObject = (): Record<string, string> => {
    return document.cookie
        .split(';')
        .map(c => c.trim())
        .filter(c => c.length > 0)
        .reduce((acc, cookie) => {
            const [name, ...rest] = cookie.split('=');
            if (name) {
                acc[name] = rest.join('=');
            }
            return acc;
        }, {} as Record<string, string>);

}

onMounted(() => {
  console.log('Valor do cookie individual (useCookie):', myCookie.value);
  console.log('Todos os cookies como objeto (puro JS):', getCookiesObject());
});

</script>

<template>
  <title>Meu Cachorro Ajuda</title>
  <div class="app">
    <AppHeader />
    <main>
      <div style="padding: 20px; text-align: center;">
        <button @click="takeScreenshot" style="padding: 10px 20px; cursor: pointer;">
          Tirar Screenshot
        </button>
      </div>
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

