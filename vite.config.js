import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    // Configuration spécifique pour Replit
    cors: true,
    allowedHosts: ['679e5b92-cd8d-4da3-845a-e606d777a07d-00-1nr9zah6hdmjg.kirk.replit.dev', '.replit.dev', '.repl.co', 'all']
  }
})