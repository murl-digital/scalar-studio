import { sveltekit } from "@sveltejs/kit/vite";
import { transformerDirectives } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path,
      },
    },
  },
  plugins: [
    UnoCSS({
      extractors: [extractorSvelte()],
      transformCSS: true,
    }),
    sveltekit(),
  ],
  define: {
    __ENABLE_CARTA_SSR_HIGHLIGHTER__: false,
  },
});
