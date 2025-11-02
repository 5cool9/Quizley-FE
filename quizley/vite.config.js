import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(),
  VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Quizley',
        short_name: 'Quizley',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#a88bfa',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
   }),
  ],
})
