import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import windicss from 'vite-plugin-windicss';

export default defineConfig({
  base: '/destiny-heatmap/',
  server: { port: 3000 },
  plugins: [
    svelte(),
    windicss({
      scan: {
        dirs: ['.'],
        fileExtensions: ['svelte', 'js', 'ts']
      }
    })
  ]
});
