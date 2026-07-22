import { defineConfig } from 'vite';

export default defineConfig({
  base: '/java-interview/',
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  }
});
