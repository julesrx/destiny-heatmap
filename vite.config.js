import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import windicss from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [
    svelte(),
    windicss({
      scan: {
        dirs: ['.'],
        fileExtensions: ['svelte', 'js', 'ts']
      }
    })
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' },
      { find: 'lib', replacement: '/src/lib' }
    ]
  }
});
