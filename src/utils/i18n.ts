
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export interface TranslationMapping {
  en: string;
  ar: string;
}

// Maps URLs between languages
export const pageTranslations: Record<string, TranslationMapping> = {
  'home': { en: '/en', ar: '/ar' },
  'about': { en: '/en/about', ar: '/ar/about' },
  'blog': { en: '/en/blog', ar: '/ar/blog' },
  'contact': { en: '/en/contact', ar: '/ar/contact' }
};

import { getTagTranslation } from '../data/tags';

// Function to get corresponding translation URL
export function getTranslationUrl(currentPath: string, targetLang: 'en' | 'ar'): string | null {
  // Check if it's a tag page
  const tagMatch = currentPath.match(/\/(en|ar)\/tags\/(.+)/);
  if (tagMatch) {
    const sourceLang = tagMatch[1] as 'en' | 'ar';
    const currentTag = decodeURIComponent(tagMatch[2]);
    
    const translatedTag = getTagTranslation(currentTag, sourceLang, targetLang);
    if (!translatedTag) return null; // Return null if no translation exists
    
    return `/${targetLang}/tags/${encodeURIComponent(translatedTag)}`;
  }

  // Handle regular pages
  const pageMappings = Object.values(pageTranslations);
  const currentMapping = pageMappings.find(mapping => 
    Object.values(mapping).includes(currentPath)
  );
  return currentMapping ? currentMapping[targetLang] : null;
}

// Function to get blog post translation
export async function getBlogTranslation(post: CollectionEntry<'blog'>) {
  if (!post.data.translationKey) return null;
  
  const otherLang = post.data.language === 'en' ? 'ar' : 'en';
  const posts = await getCollection('blog');
  
  const translatedPost = posts.find(entry => 
    entry.data.language === otherLang && 
    entry.data.translationKey === post.data.translationKey
  );
  
  return translatedPost || null;
}
