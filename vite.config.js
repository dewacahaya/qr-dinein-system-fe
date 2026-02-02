import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backendUrl = env.VITE_API_URL
    ? env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'http://127.0.0.1:8000';

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', 'localhost'],

      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          headers: { 'ngrok-skip-browser-warning': 'true' }
        },

        '/img-proxy': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/img-proxy/, ''),
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      }
    }
  }
})
