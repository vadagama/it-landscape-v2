/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

/* Макеты на HeroUI v3 и Tailwind v4. `base: './'` — сборка открывается из любого каталога: её снимает канвас (dist/ после
   `npm run build`), её же можно выложить как есть. Кит тяжёлый — предел предупреждения о размере чанка поднят. */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', sourcemap: false, target: 'es2022', chunkSizeWarningLimit: 1400 },
  test: { environment: 'jsdom', include: ['src/**/*.test.tsx'] },
});
