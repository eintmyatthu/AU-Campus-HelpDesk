import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        redirect: fileURLToPath(new URL('./redirect.html', import.meta.url)),
      },
    },
  },
  server: {
    // Proxy API calls to the Express backend during development so the
    // frontend can use same-origin relative URLs (e.g. /helpdesk/api/...).
    proxy: {
      '/helpdesk': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
