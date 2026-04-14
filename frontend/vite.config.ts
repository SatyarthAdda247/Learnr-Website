import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/gold',
  plugins: [react()],
  server: {
    host: '::',
    port: 8080,
    proxy: {
      '/content-ws': {
        target: 'https://api.adda247.com',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
})
