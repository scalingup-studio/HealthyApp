import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/HealthyApp/' // <- це ім'я репозиторію GitHub Pages
});
