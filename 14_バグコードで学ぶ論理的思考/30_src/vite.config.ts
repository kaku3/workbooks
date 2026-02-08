import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 相対パスで配信できるように
  build: {
    outDir: '../../docs/think-lab-from-buggy-code', // GitHub Pages用
    emptyOutDir: true, // ビルド前にフォルダをクリア
  },
})
