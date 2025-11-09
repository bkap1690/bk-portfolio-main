import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { join } from 'path'

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    closeBundle() {
      if (process.env.NODE_ENV === 'production') {
        const distPath = join(process.cwd(), 'dist')
        copyFileSync(
          join(distPath, 'index.html'),
          join(distPath, '404.html')
        )
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/bk-portfolio-main/' : '/',
  plugins: [react(), tailwindcss(), copy404Plugin()],
})
  