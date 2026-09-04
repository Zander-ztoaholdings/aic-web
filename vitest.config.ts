import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    // @ts-expect-error - version mismatch between vite and vitest
    react()
  ],
  test: {
    globals: true,
    // 'node', not 'jsdom': jsdom was configured but never installed, so
    // `npm test` failed to start at all rather than failing a test. Every
    // current suite is pure logic and passes under node. A test that genuinely
    // needs a DOM can opt in per file with a `// @vitest-environment jsdom`
    // comment, which will then require adding jsdom as a devDependency.
    environment: 'node',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
