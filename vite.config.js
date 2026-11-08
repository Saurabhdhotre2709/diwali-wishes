import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_PAGES
  ? '/diwali-wishes/'
  : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: { outDir: 'docs', emptyOutDir: true },
});
