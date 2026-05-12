import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// NOTE: Set `base` to '/your-repo-name/' if deploying to GitHub Pages as a project site
// (e.g. base: '/raystone-apts/'). If using a custom domain, keep it as '/'.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
})
