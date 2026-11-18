import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/users': {
        target: 'https://btx2xtbb3a.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, ''),
        secure: true,
      },
      '/api/catalog': {
        target: 'https://api.fatumapp.click',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/catalog/, '/catalog'),
        secure: true,
      },
      '/api/order': {
        target: 'https://api.fatumapp.click',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/order/, '/order'),
        secure: true,
      },
      '/api/rating': {
        target: 'https://api.fatumapp.click',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rating/, '/rating'),
        secure: true,
      },
      '/api/score': {
        target: 'https://api.fatumapp.click',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/score/, '/score'),
        secure: true,
      },
    },
  },
})
