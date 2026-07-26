import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    lightningcss: {
      targets: {
        firefox: (103 << 16),
        chrome: (76 << 16),
        safari: (15 << 16),
        edge: (79 << 16),
      },
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          if (id.includes('three')) {
            return 'three';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'lucide-react'],
  },
  define: {
    global: 'globalThis',
  },
})
