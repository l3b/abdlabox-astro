
export interface TagTranslation {
  en: string;
  ar: string;
  slug: {
    en: string;
    ar: string;
  };
}

export const tags: Record<string, TagTranslation> = {
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
  'web-development': {
    en: 'Web Development',
    ar: 'تطوير ويب',
    slug: {
      en: 'web-development',
      ar: 'تطوير-ويب'
    }
  },
  technology: {
    en: 'Technology',
    ar: 'تقنية',
    slug: {
      en: 'technology',
      ar: 'تقنية'
    }
  }
};

export function getTagTranslation(tagSlug: string, fromLang: 'en' | 'ar', toLang: 'en' | 'ar'): string | null {
  // Find tag by slug
  const tag = Object.values(tags).find(t => t.slug[fromLang] === tagSlug);
  if (!tag) return null;
  return tag.slug[toLang];
}

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}
