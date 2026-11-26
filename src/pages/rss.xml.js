import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (
    await getCollection('blog', ({ data }) => data.language === 'en' && data.isDraft !== true)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Abdla's Blog",
    description:
      'Technology insights from a consultant and runner — covering tech trends, AI, productivity, and personal growth.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/blog/${post.slug.replace(/^en\//, '')}/`,
    })),
  });
}
