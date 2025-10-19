// SEO Sitemap Generation for BloomAfter40
export function generateSitemap(baseUrl: string = 'https://bloomafter40.com'): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/dashboard',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: '/coaching',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/journal',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      url: '/progress',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/perimenopause-guide',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/checkout',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export function generateRobotsTxt(baseUrl: string = 'https://bloomafter40.com'): string {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Wellness and Health Content
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1`;
}