import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/destiny-heatmap/',
  server: { port: 3000 },
  plugins: [svelte()]
});
