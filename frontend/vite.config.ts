import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    'process.env': process.env, // Pastikan process.env diteruskan dengan benar
    global: 'globalThis',
  },
   optimizeDeps: {
    include: ['thirdweb'], // Ensure thirdweb is included
  },
});
