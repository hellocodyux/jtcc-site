import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Update to the production domain before cutover.
  site: 'https://www.joshuatreecateringco.com',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Lets us optimize the Wix-hosted photos until they're pulled local.
    domains: ['static.wixstatic.com'],
  },
});
