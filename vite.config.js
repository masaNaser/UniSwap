import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,        // ثبتي البورت
    strictPort: true,  // لو البورت مشغول ما يغيره
  }
});



// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,        // ثبتي البورت
//     strictPort: true,  // لو البورت مشغول ما يغيره
//     proxy: {
//       '/api': {
//         target: 'http://uni.runasp.net',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })

