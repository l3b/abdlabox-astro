
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog', ({ data }) => data.language === 'en');
  return rss({
    title: 'Abdla\'s Blog',
    description: 'Technology insights from a consultant and runner - covering tech trends, productivity, and personal growth',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/blog/${post.slug}/`,
    })),
  });
}
