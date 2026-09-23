import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Expose on all local network interfaces (Wi-Fi / Ethernet)
    port: 5173,
  },
});
