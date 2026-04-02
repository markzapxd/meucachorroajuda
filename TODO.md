# TailwindCSS Migration TODO

## Completed: 9/12

- [x] 1. Install Tailwind deps: `yarn add -D @tailwindcss/nuxt`
- [x] 2. Update nuxt.config.ts: Add module, remove css import
- [x] 3. Create tailwind.config.ts with custom theme/colors/animations
- [x] 4. Delete app/assets/css/main.css
- [x] 5. Refactor app/app.vue: Tailwind classes, remove inline styles
- [x] 6. Refactor app/components/AppHeader.vue: Tailwind header/nav
- [x] 7. Refactor app/components/HeroSection.vue: Tailwind hero/video
- [x] 8. Refactor app/pages/ajuda.vue: Tailwind glass-card/game
- [x] 9. Refactor app/components/DetailsSection.vue: Tailwind cards/tilt
- [ ] 10. Refactor app/pages/index.vue: Minor updates
- [ ] 11. Create globals.css for custom scrollbars/keyframes if needed
- [ ] 12. Test: `yarn dev`, check design/JS/animations/responsiveness, `yarn build`
