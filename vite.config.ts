import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'kitchen-sink',
  resolve: {
    alias: {
      '@dosage': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../dist/kitchen-sink',
    emptyOutDir: true,
  },
});
