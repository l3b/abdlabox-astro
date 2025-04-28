
import type { CollectionEntry } from 'astro:content';

export interface TranslationMapping {
  en: string;
  ar: string;
}

// Maps URLs between languages
export const pageTranslations: Record<string, TranslationMapping> = {
  'home': {
    en: '/en',
    ar: '/ar'
  },
  'about': {
    en: '/en/about',
    ar: '/ar/about'
  },
  'blog': {
    en: '/en/blog',
    ar: '/ar/blog'
  },
  'contact': {
    en: '/en/contact',
    ar: '/ar/contact'
  }
};

// Function to get corresponding translation URL
export function getTranslationUrl(currentPath: string, targetLang: 'en' | 'ar'): string | null {
  // Check if it's a tag page
  const tagMatch = currentPath.match(/\/(en|ar)\/tags\/(.+)/);
  if (tagMatch) {
    const tag = tagMatch[2];
    // Here you can add tag translations if needed
    const tagTranslations: Record<string, TranslationMapping> = {
      'learning': { en: 'learning', ar: 'تعلم' },
      'تعلم': { en: 'learning', ar: 'تعلم' },
      'web development': { en: 'web development', ar: 'تطوير-ويب' },
      'تطوير-ويب': { en: 'web development', ar: 'تطوير-ويب' },
      'astro': { en: 'astro', ar: 'أسترو' },
      'أسترو': { en: 'astro', ar: 'أسترو' }
    };
    
    if (tagTranslations[tag]) {
      return `/${targetLang}/tags/${tagTranslations[tag][targetLang]}`;
    }
    // If no translation exists, use the same tag
    return `/${targetLang}/tags/${tag}`;
  }

  // Handle regular pages
  const pageMappings = Object.values(pageTranslations);
  const currentMapping = pageMappings.find(mapping => 
    Object.values(mapping).includes(currentPath)
  );
  return currentMapping ? currentMapping[targetLang] : null;
}

import { getCollection } from 'astro:content';

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
