import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: undefined,
        assetFileNames: 'static/[name].[hash].[ext]',
        chunkFileNames: 'static/[name].[hash].js',
        entryFileNames: 'static/[name].[hash].js',
      },
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts')
    }
  }
})
