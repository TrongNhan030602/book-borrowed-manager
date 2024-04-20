import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3001,
    proxy: {
      "/books": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/borrows": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/readers": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/publishers": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/admin": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
    },
  },
});
