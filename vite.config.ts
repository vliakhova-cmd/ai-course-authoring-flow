import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/ai-course-authoring-flow/ in
// production (GitHub Actions sets GITHUB_PAGES=true — see
// .github/workflows/deploy.yml), and from the site root during local
// dev/preview.
export default defineConfig({
  // PAGES_BASE overrides it for a build that serves this app from elsewhere.
  base: process.env.PAGES_BASE ?? (process.env.GITHUB_PAGES ? '/ai-course-authoring-flow/' : '/'),
  plugins: [react()],
  // This project styles entirely with inline styles. Pin an empty PostCSS
  // config so Vite does not walk up and pick up a parent directory's Tailwind
  // setup: checked out beside sibling prototypes there may be one, and it
  // fails the build because tailwindcss is not a dependency here.
  css: { postcss: {} },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
