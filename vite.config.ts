// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, componentTagger (dev-only),
//     VITE_* env injection, @ path alias, React/TanStack dedupe, error logger plugins.
//
// Deployment target is controlled by the `nitro.preset` option:
//   - "cloudflare-module" (default) → Cloudflare Workers via wrangler
//   - "vercel"                      → Vercel Serverless Functions
//   - "node-server"                 → plain Node.js (local preview)
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});
