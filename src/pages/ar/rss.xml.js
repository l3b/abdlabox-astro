import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (
    await getCollection('blog', ({ data }) => data.language === 'ar' && data.isDraft !== true)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'مدونة عبدالله',
    description: 'أحدث المقالات والأفكار حول التكنولوجيا، الذكاء الاصطناعي، إدارة المعرفة، والجري.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/ar/blog/${post.slug.replace(/^ar\//, '')}/`,
    })),
  });
}
