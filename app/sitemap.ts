import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  const routes = ['/'].map((route) => ({
    url: `https://gwa.vps.aleczr.link${route}`,
    lastModified: lastModified,
  }));

  return routes;
}
