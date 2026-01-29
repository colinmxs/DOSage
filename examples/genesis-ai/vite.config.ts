import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/examples/',
  resolve: {
    alias: {
      dosage: resolve(__dirname, '../../src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
