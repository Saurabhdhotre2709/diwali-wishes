import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const [owner, repository] = (process.env.GITHUB_REPOSITORY || '').split('/');
const base = process.env.GITHUB_ACTIONS
  ? repository === `${owner}.github.io` ? '/' : `/${repository}/`
  : '/';

export default defineConfig({
  plugins: [react()],
  base,
});
