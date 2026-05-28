import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue'],
      dts: resolve(__dirname, 'src/auto-imports.d.ts'),
      vueTemplate: true,
    }),
    Components({
      dirs: [
        resolve(__dirname, 'src/components'),
        resolve(__dirname, 'src/layouts'),
      ],
      dts: false,
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: {
        'construct-ui': resolve(__dirname, 'src/index.ts'),
        'vite': resolve(__dirname, 'src/vite.ts'),
      },
      formats: ['es'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'vue',
        'reka-ui',
        /^reka-ui\//,
        '@iconify/vue',
        'unplugin-auto-import/vite',
        'unplugin-vue-components',
        'unplugin-vue-components/vite',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
