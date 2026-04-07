import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/content-ws': {
        target: 'https://api.adda247.com',
        changeOrigin: true,
      }
    }
  }
})
