import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        features: resolve(__dirname, 'features.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        'blog-staged-validation': resolve(__dirname, 'blog/staged-validation.html'),
        'blog-semantic-realignment': resolve(__dirname, 'blog/semantic-realignment.html'),
        'blog-building-driftbench': resolve(__dirname, 'blog/building-driftbench.html'),
        'blog-lpa-vs-gma': resolve(__dirname, 'blog/lpa-vs-gma.html'),
        'blog-kern-models': resolve(__dirname, 'blog/kern-models.html'),
        'blog-cost-of-delay': resolve(__dirname, 'blog/cost-of-delay.html'),
      },
    },
  },
});
