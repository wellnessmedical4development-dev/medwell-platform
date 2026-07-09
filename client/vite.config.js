import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.MOV', '**/*.mov', '**/*.mp4'],
  plugins: [
    react(),
    {
      name: 'no-crossorigin',
      transformIndexHtml(html) {
        return html.replace(/(<script\s[^>]*?)\bcrossorigin\s*/g, '$1');
      },
    },
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
