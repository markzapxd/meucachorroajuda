<script setup lang="ts">
import html2canvas from 'html2canvas';

useSeoMeta({
  title: 'Ajude pitoco',
  ogTitle: 'Ajude pitoco',
  description: 'Site feito para ajudar meu cachorro que esta passando por momento dificeis',
  ogDescription: 'Site feito para ajudar meu cachorro que esta passando por momento dificeis',
  ogType: 'website',
  ogImage: '/images/hero-dog.png',
  twitterCard: 'summary_large_image',
})

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

</script>

<template>
  <div class="app">
    <AppHeader />
    <main>
      <div style="padding: 20px; text-align: center;">
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

