import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todo lo que vaya a /apps-script se rebota a Apps Script
      "/apps-script": {
        target:
          "https://script.google.com/macros/s/AKfycbz5twJK0-ugiiRpM-pIgPyq2P9IWMXnaoWCevW9utU7FfcGixB8OwDFGhXUAvlmAAQ/exec",
        changeOrigin: true,
        secure: true,
        // Quitamos el prefijo /apps-script al reenviar
        rewrite: (path) => path.replace(/^\/apps-script/, ""),
      },
    },
  },
});
