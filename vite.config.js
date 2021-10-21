import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import windicss from 'vite-plugin-windicss';

export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    base: process.env.VITE_BASE_PATH,
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
        { find: 'views', replacement: '/src/views' },
        { find: 'lib', replacement: '/src/lib' }
      ]
    }
  });
};
