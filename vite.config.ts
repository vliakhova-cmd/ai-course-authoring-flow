import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/ai-course-authoring-flow/ in
// production (GitHub Actions sets GITHUB_PAGES=true — see
// .github/workflows/deploy.yml), and from the site root during local
// dev/preview.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/ai-course-authoring-flow/' : '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
