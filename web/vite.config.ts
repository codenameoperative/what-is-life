import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('phaser')) return 'phaser'
            if (id.includes('react') || id.includes('react-dom')) return 'react'
            if (id.includes('@supabase')) return 'supabase'
            return 'vendor'
          }
          // Feature chunks
          if (id.includes('AdvancedCharacterCreator')) return 'character-creator'
          if (id.includes('activities/')) return 'activities'
          if (id.includes('components/')) return 'components'
        },
      },
    },
    sourcemap: false, // Disable for production performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['phaser'],
    exclude: ['@vite/client', '@vite/env'],
  },
  // Performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
})
