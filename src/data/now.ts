// Bilingual data for /ar/now and /en/now — edit monthly to keep your site alive!

export interface NowSection {
  icon: string;
  title: { ar: string; en: string };
  items: Array<{ ar: string; en: string }>;
}

export const nowData = {
  lastUpdated: {
    ar: 'نوفمبر 2026',
    en: 'November 2026',
  },
  intro: {
    ar: 'لقطة سريعة لما أركز عليه هذه الفترة في العمل، الجري، القراءة، والمشاريع الشخصية.',
    en: 'A quick snapshot of what I am currently focused on across work, running, reading, and side projects.',
  },
  sections: [
    {
      icon: 'mdi:rocket-launch-outline',
      title: { ar: 'أبني وأستكشف', en: 'Building & Exploring' },
      items: [
        {
          ar: 'إعادة إطلاق abdla.box بتصميم جديد لعام 2026 وتجربة نشر خفيفة عبر «إشارات».',
          en: 'Relaunching abdla.box with a 2026 Electric Dunes design and frictionless Signals publishing.',
        },
        {
          ar: 'استكشاف وكلاء الذكاء الاصطناعي وسير العمل البرمجي الذكي في المشاريع اليومية.',
          en: 'Exploring AI coding agents and practical automation workflows in day-to-day consulting.',
        },
      ],
    },
    {
      icon: 'mdi:run-fast',
      title: { ar: 'الجري واللياقة', en: 'Running & Training' },
      items: [
        {
          ar: 'الحفاظ على استمرارية الجري الأسبوعي في الدمام بعد سباق ديار في البحرين 🇧🇭.',
          en: 'Building consistent weekly mileage in Dammam fresh off Diyar Race in Bahrain 🇧🇭.',
        },
        {
          ar: 'تحليل الجريات والأداء عبر Garmin وربط الإحصاءات مباشرة بهذه المساحة.',
          en: 'Tracking training rhythm, pace, and heart rate directly from Garmin onto this site.',
        },
      ],
    },
    {
      icon: 'mdi:book-open-page-variant-outline',
      title: { ar: 'أقرأ وأتعلم', en: 'Reading & Learning' },
      items: [
        {
          ar: 'أقرأ في الاستراتيجية القيادية وبناء «العقل الثاني» وإدارة المعرفة الشخصية.',
          en: 'Reading on leadership transitions, business strategy, and Personal Knowledge Management.',
        },
        {
          ar: 'مشاركة الدروس السريعة والتجارب العملية بدون انتظار المثالية.',
          en: 'Sharing quick lessons and practical notes in public instead of waiting for perfection.',
        },
      ],
    },
  ] satisfies NowSection[],
};
