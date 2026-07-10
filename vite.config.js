import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 検証用サイトは任意の場所（ルート/サブパス/静的配信）から開けるよう相対パスにする
  base: './',
});
