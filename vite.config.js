import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@utils': path.resolve(__dirname, './client/src/utils'),
      '@assets': path.resolve(__dirname, './client/src/assets'),
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: false,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'starknet-vendor': ['starknet', 'get-starknet-core'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'starknet', 'chart.js'],
  },
})