import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/project-test-4-flight-reservation-ai/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
