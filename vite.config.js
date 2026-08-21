import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    // Keep the printable marker as a real deployed file instead of a data URI.
    assetsInlineLimit: 0,
  },
});
