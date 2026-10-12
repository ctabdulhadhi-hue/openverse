import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    fileParallelism: false,
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "**/*.unit.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "tests/e2e/**", "functions/**"],
    css: false,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["app/**", "components/**", "game/**", "lib/**", "shared/**"],
    },
  },
});
