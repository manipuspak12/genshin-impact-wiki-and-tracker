import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pin to IPv4 loopback. Vite otherwise binds 127.0.0.1 while `localhost`
    // also resolves to ::1 — IPv6-preferring clients (notably VS Code's webview
    // renderer, which powers Simple Browser and Browse Lite) try ::1 first, get
    // ECONNREFUSED, and render a blank page.
    //
    // Always open http://127.0.0.1:5173 — not http://localhost:5173.
    // To use `localhost` instead, set host to '::' (dual-stack) or true
    // (all interfaces), but both expose the dev server beyond this machine.
    host: '127.0.0.1',
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    strictPort: true,
  },
})
