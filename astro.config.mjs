import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://timjedrek.com",
  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      entryLimit: 10000,
      filter: (page) => !page.includes("/404"),
      customPages: [
        "https://timjedrek.com",
        "https://timjedrek.com/blog",
        "https://timjedrek.com/tos",
      ],
    }),
    tailwind(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
