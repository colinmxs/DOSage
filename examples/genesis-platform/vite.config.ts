import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),
  resolve: {
    alias: {
      // Allow importing from 'dosage' as if it were the published package
      'dosage': resolve(__dirname, '../../src/index.ts'),
      'dosage/themes': resolve(__dirname, '../../src/themes'),
      'dosage/styles': resolve(__dirname, '../../src/styles'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
