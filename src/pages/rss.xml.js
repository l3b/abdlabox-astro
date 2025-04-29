
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog', ({ data }) => data.language === 'en');
  return rss({
    title: 'Abdla\'s Blog',
    description: 'Personal blog about technology and web development',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/blog/${post.slug}/`,
    })),
  });
}
