import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),       // General alias for src
      '@admin': path.resolve(__dirname, './src/admin'), // Alias for admin code
      '@client': path.resolve(__dirname, './src/client'), // Alias for client
    },
  },
  server: {
    port: 1000,
    host: '0.0.0.0',
  },
});
