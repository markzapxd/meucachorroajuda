<script setup lang="ts">
import { onMounted } from 'vue';
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

useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap'
    }
  ],
  style: [
    {
      innerHTML: `
        body { 
          background-color: #0d0d0d !important; 
          color: white; 
          margin: 0; 
          font-family: 'Outfit', sans-serif;
        }
      `
    }
  ]
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
    <NuxtPage />
  </div>
</template>


<style>
.app {
  min-height: 100vh;
}
</style>
