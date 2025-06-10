import { z } from 'astro:content';

export interface TagTranslation {
  en: string;
  ar: string;
  slug: {
    en: string;
    ar: string;
  };
}

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
    ar: 'تطوير ويب',
    slug: {
      en: 'web-development',
      ar: 'تطوير-ويب'
    }
  },
  ai: {
    en: 'AI',
    ar: 'الذكاء-الاصطناعي',
    slug: {
      en: 'ai',
      ar: 'الذكاء-الاصطناعي'
    }
  },
  vibecoding: {
    en: 'Vibecoding',
    ar: 'البرمذة',
    slug: {
      en: 'vibecoding',
      ar: 'البرمذة'
    }
  }
};

// Helper function to find tag by any property
export function findTagByValue(value: string): TagTranslation | undefined {
  return Object.values(baseTagTranslations).find(tag => 
    tag.en === value || 
    tag.ar === value || 
    tag.slug.en === value || 
    tag.slug.ar === value
  );
}

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

// Generate a tag translation automatically if it doesn't exist
export function getOrCreateTag(tag: string): TagTranslation {
  const existing = findTagByValue(tag);
  if (existing) return existing;
  
  // Create automatic translation
  const normalizedTag = normalizeTag(tag);
  return {
    en: tag,
    ar: tag, // Same for both languages if no translation exists
    slug: {
      en: normalizedTag,
      ar: normalizedTag
    }
  };
}.replace(/\s+/g, '-');
}

export const tags = baseTagTranslations;