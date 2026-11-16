import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      "@apiDatabase/constants": fileURLToPath(
        new URL(
          "./node_modules/ta_data_mas/packages/constants/src/index.ts",
          import.meta.url,
        )
      ),

      "@apiDatabase/types": fileURLToPath(
        new URL(
          "./node_modules/ta_data_mas/packages/types/src/index.ts",
          import.meta.url,
        ),
      ),
    },
  },
  optimizeDeps: {
    include: ['ta_data_mas'],
  },

  server: {
    proxy: {
      "/api": {
        target: "https://web-four-rust-92.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
})