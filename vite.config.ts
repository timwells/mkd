import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { vuestic } from '@vuestic/compiler/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vuestic(),
    vue(),
    VueI18nPlugin({
      include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  resolve: {
    alias: {
      // @ → src folder
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src')
    }
  }
})


