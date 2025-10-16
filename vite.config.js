import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cr1.github.io/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
});
