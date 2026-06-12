import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ✅ FIX: Default "/" — Vercel pe base path "/" hona chahiye
  // GitHub Pages ke liye VITE_BASE_PATH=/Mern-AuthKit set karo env mein
  base: process.env.VITE_BASE_PATH || "/",
});
