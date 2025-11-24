import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Change port here
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,     // 👈 change this to any free port, e.g. 5175 or 3001
    open: true,     // automatically open browser
  },
})
