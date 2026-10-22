import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build works on any static host path (Cloudflare Pages, GitHub Pages subpath, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
})
