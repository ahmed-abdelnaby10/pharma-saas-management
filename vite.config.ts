import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/**
 * Pull heavy `node_modules` into separate chunks. Do not use a catch-all `vendor` bucket —
 * that creates circular chunk graphs with `vendor-react` / Radix. Unlisted packages stay in
 * Rollup’s default chunks.
 */
function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;

  if (id.includes("@mui") || id.includes("@emotion")) return "vendor-mui";
  if (id.includes("recharts")) return "vendor-recharts";
  if (id.includes("lucide-react")) return "vendor-lucide";
  if (id.includes("node_modules/motion") || id.includes("node_modules\\motion"))
    return "vendor-motion";
  if (id.includes("@tanstack/react-query")) return "vendor-react-query";
  if (id.includes("react-router")) return "vendor-react-router";
  if (id.includes("i18next") || id.includes("react-i18next"))
    return "vendor-i18n";
  if (id.includes("@radix-ui")) return "vendor-radix";
  if (id.includes("xlsx")) return "vendor-xlsx";
  if (id.includes("@sentry")) return "vendor-sentry";
  if (id.includes("axios")) return "vendor-axios";
  if (id.match(/node_modules[\\/](react-dom|react)[\\/]/))
    return "vendor-react";

  return undefined;
}

export default defineConfig({
  // Prevent Vite from clearing the terminal when running alongside Tauri output.
  clearScreen: false,

  server: {
    port: 5173,
    // Tauri requires a fixed port; fail fast if it's already in use.
    strictPort: true,
    // TAURI_DEV_HOST is set by Tauri for remote device dev (mobile/LAN). Unused for desktop.
    host: process.env.TAURI_DEV_HOST || false,
  },

  // Expose TAURI_* env vars to the frontend (e.g. TAURI_ENV_TARGET_TRIPLE).
  envPrefix: ["VITE_", "TAURI_"],

  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  /** Pre-bundle a single React for dev so context (e.g. AppProvider) is not duplicated across chunks. */
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
    // Avoid two React copies / two context instances (useApp "outside AppProvider" despite Provider in tree).
    dedupe: ["react", "react-dom"],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
    /**
     * Minified size of the main `index` chunk (mostly `src/` + unsplit deps) can stay >500 kB;
     * gzip is typically ~300 kB. Route-level `React.lazy` would shrink the main chunk further.
     */
    chunkSizeWarningLimit: 1600,
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
