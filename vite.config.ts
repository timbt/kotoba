import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/kotoba/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Node.js v25 ships a native Web Storage API that conflicts with jsdom's
    // localStorage implementation, producing "--localstorage-file" warnings.
    execArgv: ["--no-webstorage"],
  },
});
