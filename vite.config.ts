import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DOSage',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'esm/index.js';
        if (format === 'cjs') return 'cjs/index.cjs';
        return `${format}/index.js`;
      },
    },
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Preserve module structure for tree-shaking
        preserveModules: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/dosage.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  css: {
    // Extract CSS to separate file
    modules: false,
  },
});
