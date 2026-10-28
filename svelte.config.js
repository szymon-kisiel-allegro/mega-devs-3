// Renders the kb the way the desk reads it: .svx pages through mdsvex, the runbook layout,
// components from src/lib. `npm run build` writes every page as static HTML to rendered/.
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.svx'], layout: { runbook } })],
  kit: {
    adapter: adapter({ pages: 'rendered', assets: 'rendered', strict: true }),
    alias: { '#lib': 'src/lib' },
    prerender: { entries: ['/kb'] },
    inlineStyleThreshold: Infinity,
  },
};
