// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true // Auto buka browser
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 👈 use `resolve` safely
    },
  },
});
