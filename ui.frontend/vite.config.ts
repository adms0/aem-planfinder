import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/site.ts', import.meta.url)),
      name: 'PlanFinderSite',
      formats: ['iife'],
      fileName: () => 'js/site.js',
      cssFileName: 'css/site'
    }
  }
});
