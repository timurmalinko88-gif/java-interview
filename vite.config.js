import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/java-interview/',
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 6500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@mlc-ai/web-llm')) {
            return 'vendor-webllm';
          }
          if (id.includes('node_modules/@xenova/transformers') || id.includes('node_modules/onnxruntime-web')) {
            return 'vendor-transformers';
          }
        }
      }
    }
  },
  worker: {
    format: 'es',
  },
  server: {
    open: true,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /index\.json/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'catalog-cache',
              networkTimeoutSeconds: 3
            }
          }
        ]
      },
      manifest: {
        name: 'Java Interview Prep Hub',
        short_name: 'Java Prep',
        description: 'Comprehensive simulator for Java Developer Interviews',
        theme_color: '#3b82f6',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
