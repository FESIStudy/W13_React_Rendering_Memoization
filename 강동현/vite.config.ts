import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import "babel-plugin-react-compiler"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        "babel-plugin-react-compiler"
      ]
    }
  })],
  // plugins:[react()]
})
