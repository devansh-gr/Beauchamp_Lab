import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages project sites live under /<repo>/; the deploy workflow sets BASE.
  base: process.env.BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
