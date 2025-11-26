<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://medilocator-complete.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), 
      }
    }
  }
});
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/ap': {
      target: 'https://medilocator-complete.onrender.com/api',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/req/, '') 
    }
  }
}
})
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
