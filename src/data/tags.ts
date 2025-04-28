
import { z } from 'astro:content';

export interface TagTranslation {
  en: string;
  ar: string;
  slug: {
    en: string;
    ar: string;
  };
}

// Base tags that are known and have translations
const baseTagTranslations: Record<string, TagTranslation> = {
  astro: {
    en: 'Astro',
    ar: 'أسترو',
    slug: {
      en: 'astro',
      ar: 'أسترو'
    }
  },
  learning: {
    en: 'Learning',
    ar: 'تعلم',
    slug: {
      en: 'learning',
      ar: 'تعلم'
    }
  },
  technology: {
    en: 'Technology',
    ar: 'تقنية',
    slug: {
      en: 'technology',
      ar: 'تقنية'
    }
  },
  'artificial-intelligence': {
    en: 'Artificial Intelligence',
    ar: 'ذكاء إصطناعي',
    slug: {
      en: 'artificial-intelligence',
      ar: 'ذكاء-إصطناعي'
    }
  },
  'web-development': {
    en: 'Web Development',
    ar: 'تطوير الويب',
    slug: {
      en: 'web-development',
      ar: 'تطوير-الويب'
    }
  }
};

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

// Dynamic tag handling
export function createTagTranslation(tag: string, lang: 'en' | 'ar'): TagTranslation {
  const normalizedTag = normalizeTag(tag);
  
  // If tag exists in base translations, return it
  if (normalizedTag in baseTagTranslations) {
    return baseTagTranslations[normalizedTag];
  }

  // Create new tag translation
  return {
    en: lang === 'en' ? tag : normalizedTag,
    ar: lang === 'ar' ? tag : normalizedTag,
    slug: {
      en: normalizedTag,
      ar: lang === 'ar' ? tag.replace(/\s+/g, '-') : normalizedTag
    }
  };
}

// Export tags and add dynamic tag handling
export const tags = new Proxy(baseTagTranslations, {
  get(target, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    // Try to find by normalized version
    const normalized = normalizeTag(prop);
    if (normalized in target) {
      return target[normalized];
    }
    // Create new tag translation (default to English)
    return createTagTranslation(prop, 'en');
  }
});
