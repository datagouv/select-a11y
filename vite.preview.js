import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        exports: "named",
      },
    }
  },
  test: {
    testTimeout: 30_000
  }
});
