import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.js',
    },
    resolve: {
      // Removed absolute path aliases that were breaking tests for other users
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/getStudentResults': backendUrl,
        '/getAllApplications': backendUrl,
        '/getAllResults': backendUrl,
        '/addStudent': backendUrl,
        '/getAllStudents': backendUrl,
        '/getStudent': backendUrl,
        '/addExam': backendUrl,
        '/getAllExams': backendUrl,
        '/fill-form': backendUrl,
        '/get-form': backendUrl,
      }
    }
  }
})