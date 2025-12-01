// vite.config.ts
import { defineConfig } from "file:///D:/dev/mkd/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/dev/mkd/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path from "path";
import { fileURLToPath } from "url";
import VueI18nPlugin from "file:///D:/dev/mkd/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { vuestic } from "file:///D:/dev/mkd/node_modules/@vuestic/compiler/dist/vite/vite-plugin.js";
var __vite_injected_original_import_meta_url = "file:///D:/dev/mkd/vite.config.ts";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    vuestic(),
    vue(),
    VueI18nPlugin({
      include: path.resolve(path.dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src/i18n/locales/**")
    })
  ],
  resolve: {
    alias: {
      // @ → src folder
      "@": path.resolve(path.dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZXZcXFxcbWtkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxkZXZcXFxcbWtkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9kZXYvbWtkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXG5pbXBvcnQgeyB2dWVzdGljIH0gZnJvbSAnQHZ1ZXN0aWMvY29tcGlsZXIvdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlc3RpYygpLFxuICAgIHZ1ZSgpLFxuICAgIFZ1ZUkxOG5QbHVnaW4oe1xuICAgICAgaW5jbHVkZTogcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnLi9zcmMvaTE4bi9sb2NhbGVzLyoqJyksXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgLy8gQCBcdTIxOTIgc3JjIGZvbGRlclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzTixTQUFTLG9CQUFvQjtBQUNuUCxPQUFPLFNBQVM7QUFDaEIsWUFBWSxVQUFVO0FBQ3RCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsZUFBZTtBQUx5RyxJQUFNLDJDQUEyQztBQVFsTCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsSUFBSTtBQUFBLElBQ0osY0FBYztBQUFBLE1BQ1osU0FBYyxhQUFhLGFBQVEsY0FBYyx3Q0FBZSxDQUFDLEdBQUcsdUJBQXVCO0FBQUEsSUFDN0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQTtBQUFBLE1BRUwsS0FBVSxhQUFhLGFBQVEsY0FBYyx3Q0FBZSxDQUFDLEdBQUcsT0FBTztBQUFBLElBQ3pFO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
