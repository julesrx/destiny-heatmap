import sveltePreprocess from 'svelte-preprocess';
import { windi } from 'svelte-windicss-preprocess';

export default {
  preprocess: [sveltePreprocess(), windi()]
};
