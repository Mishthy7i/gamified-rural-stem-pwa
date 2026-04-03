import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    manifest: {
      name: 'stem-rural-pwa',
      short_name: 'edu',
      description: 'stem education platform for rural students',
      theme_color: '#6c82d9',

      icons: [
  {
    src: '/icon.png',
    sizes: '192x192',
    type: 'image/png'
  }
],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})