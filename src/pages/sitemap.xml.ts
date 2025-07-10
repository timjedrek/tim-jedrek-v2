import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params, request }) => {
  const posts = await getCollection("blog");
  const store = await getCollection("store");

  const baseUrl = "https://timjedrek.com";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: baseUrl, lastmod: currentDate, changefreq: "weekly", priority: 1.0 },
    {
      url: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tos`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.3,
    },
  ];

  // Blog posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.data.updatedDate || post.data.pubDate,
    changefreq: "monthly",
    priority: 0.7,
  }));

  // Store pages
  const storePages = store.map((item) => ({
    url: `${baseUrl}/store/${item.slug}`,
    lastmod: item.data.updatedDate,
    changefreq: "monthly",
    priority: 0.6,
  }));

  // All pages
  const allPages = [...staticPages, ...blogPages, ...storePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date(page.lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
