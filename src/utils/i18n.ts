import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type Locale = 'ar' | 'en';

export async function getBlogTranslation(post: CollectionEntry<'blog'>) {
  if (!post.data.translationKey) return null;

  const otherLang: Locale = post.data.language === 'en' ? 'ar' : 'en';
  const posts = await getCollection('blog', ({ data }) => !data.isDraft);

  return (
    posts.find(
      (entry) =>
        entry.data.language === otherLang &&
        entry.data.translationKey === post.data.translationKey
    ) || null
  );
}

export async function getAlternatePath(
  currentPath: string,
  currentLocale: Locale
): Promise<string> {
  const alternateLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';

  if (cleanPath === '/' || cleanPath === `/${currentLocale}`) {
    return `/${alternateLocale}/`;
  }

  if (cleanPath.includes('/tags/')) {
    return `/${alternateLocale}/blog/`;
  }

  const blogPostMatch = cleanPath.match(new RegExp(`^/${currentLocale}/blog/([^/]+)$`));
  if (blogPostMatch) {
    const slug = `${currentLocale}/${blogPostMatch[1]}`;
    const allPosts = await getCollection('blog', ({ data }) => !data.isDraft);
    const currentPost = allPosts.find((post) => post.slug === slug);

    if (currentPost) {
      const translatedPost = await getBlogTranslation(currentPost);
      if (translatedPost) {
        return `/${alternateLocale}/blog/${translatedPost.slug.replace(/^(en|ar)\//, '')}`;
      }
    }
    return `/${alternateLocale}/blog/`;
  }

  if (cleanPath.startsWith(`/${currentLocale}/`)) {
    return cleanPath.replace(new RegExp(`^/${currentLocale}`), `/${alternateLocale}`);
  }

  return `/${alternateLocale}/`;
}
