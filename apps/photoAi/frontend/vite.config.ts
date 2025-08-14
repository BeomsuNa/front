import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css : {
    postcss: {

    },
  },
  plugins: [react(), tailwindcss()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // @ → src 폴더
    },
  },
    server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
  
})
