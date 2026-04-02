<script setup lang="ts">
import { ref, onMounted } from 'vue';

useSeoMeta({
  title: 'Ajude pitoco',
  ogTitle: 'Ajude pitoco',
  description: 'Site feito para ajudar meu cachorro que esta passando por momento dificeis',
  ogDescription: 'Site feito para ajudar meu cachorro que esta passando por momento dificeis',
  ogType: 'website',
  ogImage: '/images/madobe_nanami_1.jpg',
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
        html, body { 
          background-color: #0d0d0d !important; 
          color: white; 
          margin: 0; 
          padding: 0;
          font-family: 'Outfit', sans-serif;
        }
        .app { background-color: #0d0d0d; }
      `
    }
  ]
})

const isLoaded = ref(false)

onMounted(() => {
  // Mark as loaded after hydration
  isLoaded.value = true
})

</script>

<template>
  <div class="app" :class="{ 'loaded': isLoaded }">
    <AppHeader />
    <NuxtPage />
  </div>
</template>


<style>
.app {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.4s ease-in;
}

.app.loaded {
  opacity: 1;
}
</style>
