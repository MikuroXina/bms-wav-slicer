import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 8000,
    },
    plugins: [react(), tailwindcss()],
});
