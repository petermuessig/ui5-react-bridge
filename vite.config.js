import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ui5 from './lib/vitejs-plugin-ui5.js';

export default defineConfig(() => {
  return {
    server: {
      open: true,
    },    
    build: {
      outDir: 'build',
    },
    plugins: [
        react(),
        ui5(),
    ],
  };
});
