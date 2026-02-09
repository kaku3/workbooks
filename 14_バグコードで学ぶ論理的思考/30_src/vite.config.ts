import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' 
    ? '/workbooks/think-lab-from-buggy-code/'
    : '/';

  return {
    plugins: [react()],
    base,
    build: {
      outDir: '../../docs/think-lab-from-buggy-code', // GitHub Pages用
      emptyOutDir: true, // ビルド前にフォルダをクリア
    },
  };
});
