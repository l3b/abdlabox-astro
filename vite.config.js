import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Allow connections from all hosts
    port: 5000, // Set the server port to 5000
    hmr: {
      clientPort: 5000, // Match client port with server port
      host: "f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev", // Ensure this matches your current host
    },
    allowedHosts: [
      "f8bcf973-494c-455a-995f-846331ae66de-00-uyvd18bso6i1.pike.replit.dev", // Your specific host
      ".replit.dev",
      "0.0.0.0",
      "localhost",
      true, // Allow all hosts
    ],
    headers: {
      "Access-Control-Allow-Origin": "*", // Enable CORS
    },
  },
});
