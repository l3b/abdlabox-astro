
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

// Tag translations mapping
export const tagTranslations: Record<string, TranslationMapping> = {
  'astro': { en: 'astro', ar: 'أسترو' },
  'أسترو': { en: 'astro', ar: 'أسترو' },
  'learning': { en: 'learning', ar: 'تعلم' },
  'تعلم': { en: 'learning', ar: 'تعلم' },
  'web development': { en: 'web-development', ar: 'تطوير-ويب' },
  'تطوير-ويب': { en: 'web-development', ar: 'تطوير-ويب' },
  'technology': { en: 'technology', ar: 'تقنية' },
  'تقنية': { en: 'technology', ar: 'تقنية' },
  'ai': { en: 'ai', ar: 'ذكاء-إصطناعي' },
  'ذكاء-إصطناعي': { en: 'ai', ar: 'ذكاء-إصطناعي' }
};

// Function to normalize tags for URLs
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

// Function to get corresponding translation URL
export function getTranslationUrl(currentPath: string, targetLang: 'en' | 'ar'): string | null {
  // Check if it's a tag page
  const tagMatch = currentPath.match(/\/(en|ar)\/tags\/(.+)/);
  if (tagMatch) {
    const currentTag = decodeURIComponent(tagMatch[2]);
    
    // Find translation mapping
    let translatedTag = currentTag;
    for (const [key, mapping] of Object.entries(tagTranslations)) {
      if (normalizeTag(key) === normalizeTag(currentTag)) {
        translatedTag = mapping[targetLang];
        break;
      }
    }
    
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
