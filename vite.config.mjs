import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

// Standalone, root-mounted demo. No containing-workspace config or middleware.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: '/',
  envFile: false,
  plugins: [react(), tailwind()],
  cacheDir: '.cache/vite',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
  build: { outDir: 'dist', emptyOutDir: true, sourcemap: false },
});