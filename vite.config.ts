import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Ligand',
      fileName: (format) => `ligand.${format}.js`,
    },
    rollupOptions: {
      // Vue is expected to be provided by consuming projects, so exclude from bundle.
      external: ['vue', 'primevue', 'naive-ui'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
