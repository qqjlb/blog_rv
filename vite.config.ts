import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css:{
    preprocessorOptions:{
      less:{
        charset:false,
        additionalData:`@import "./src/style/less/global.less";`
      }
    }
  }
})
