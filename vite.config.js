import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// html2pdf.js ships an old html2canvas that can't parse Tailwind v4's oklch() colors
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { html2canvas: 'html2canvas-pro' } },
})
