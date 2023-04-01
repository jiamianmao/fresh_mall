import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'common': path.resolve(__dirname, 'src/common')
    },
    extensions: ['.js', '.vue', '.json']
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          hack: `true; @import '@/common/less/index.less';`
        }
      }
    }
  }
})
