import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todo lo que vaya a /apps-script se rebota a Apps Script
      "/apps-script": {
        changeOrigin: true,
        secure: true,
        // Quitamos el prefijo /apps-script al reenviar
        rewrite: (path) => path.replace(/^\/apps-script/, ""),
      },
    },
  },
});
