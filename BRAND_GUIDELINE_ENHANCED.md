# **Abdla Brand Guidelines — Electric Dunes Identity**
## **Comprehensive Design System v2.0**

---

## **1. Brand Foundation**

### **1.1 Brand Identity**
- **English Name:** Abdla
- **Arabic Name:** عبدالله
- **Pronunciation:** /ʕab-dal-lah/
- **Domain:** abdla.box
- **Location:** Dammam, Eastern Province, Saudi Arabia

### **1.2 Brand Promise**
**English:** "Where knowledge meets curiosity"  
**Arabic:** «حيث يلتقي العلم بالفضول»

### **1.3 Brand Personality**
- **Primary Archetype:** The Sage (65%) — Wisdom, Knowledge, Understanding
- **Secondary Archetype:** The Creator (35%) — Innovation, Imagination, Expression

### **1.4 Mission Statement**
To bridge technology and culture through authentic storytelling, continuous learning, and meaningful connections, inspiring others to explore the intersection of innovation and tradition.

---

## **2. Color System**

### **2.1 Primary Palette**

```css
:root {
  /* Primary Colors */
  --electric-blue: #0EA5E9;    /* Sky-500 - Main brand color */
  --electric-blue-dark: #0284C7; /* Sky-600 - Hover state */
  --electric-blue-light: #38BDF8; /* Sky-400 - Light variant */
  
  --neon-yellow: #FFE600;       /* Custom - CTA & highlights */
  --neon-yellow-dark: #FACC15;  /* Amber-400 - Hover state */
  --neon-yellow-light: #FEF3C7; /* Amber-100 - Background */
}
```

### **2.2 Secondary Palette**

```css
:root {
  /* Category Colors */
  --teal: #14B8A6;              /* Teal-500 - Dammam content */
  --lavender: #A78BFA;          /* Violet-400 - Knowledge */
  --lime: #84CC16;              /* Lime-500 - Sports */
  --coral: #FB7185;             /* Rose-400 - Social */
  --slate: #475569;             /* Slate-600 - Faith */
}
```

### **2.3 Neutral Palette**

```css
:root {
  /* Light Mode Neutrals */
  --background: #FAFAFA;        /* Neutral-50 */
  --surface: #FFFFFF;           /* White */
  --text-primary: #0F172A;      /* Slate-900 */
  --text-secondary: #475569;    /* Slate-600 */
  --border: #E2E8F0;           /* Slate-200 */
  
  /* Dark Mode Neutrals */
  --dark-background: #0A0A0A;   /* Near black */
  --dark-surface: #18181B;      /* Zinc-900 */
  --dark-text-primary: #FAFAFA; /* Neutral-50 */
  --dark-text-secondary: #A1A1AA; /* Zinc-400 */
  --dark-border: #27272A;       /* Zinc-800 */
}
```

### **2.4 Semantic Colors**

```css
:root {
  --success: #10B981;           /* Emerald-500 */
  --warning: #F59E0B;           /* Amber-500 */
  --error: #EF4444;             /* Red-500 */
  --info: #3B82F6;              /* Blue-500 */
}
```

### **2.5 Color Usage Guidelines**

| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary Actions | electric-blue | electric-blue-light |
| Hover States | electric-blue-dark | neon-yellow |
| Text Links | electric-blue | teal |
| Backgrounds | background/surface | dark-background/dark-surface |
| Borders | border | dark-border |
| Category Tags | Category color @ 100% | Category color @ 80% opacity |

---

## **3. Typography System**

### **3.1 Font Families - FINAL IMPLEMENTATION**

#### **Arabic Typography**
```css
:root {
  --font-arabic-display: 'Year of Camel', 'AlNaseeb', sans-serif;
  --font-arabic-ui: 'Vazirmatn', 'IBM Plex Sans Arabic', sans-serif;
  --font-arabic-body: 'IBM Plex Sans Arabic', 'Readex Pro', sans-serif;
}
```

#### **English Typography**
```css
:root {
  --font-english-display: 'Space Grotesk', 'Inter', sans-serif;
  --font-english-ui: 'Inter', 'Plus Jakarta Sans', sans-serif;
  --font-english-body: 'Plus Jakarta Sans', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'Cascadia Code', monospace;
}
```

#### **Brand Logo Font**
```css
:root {
  --font-logo: 'Comfortaa', 'Quicksand', sans-serif;
}
```

### **3.2 Type Scale**

| Level | English Size | Arabic Size | Line Height | Usage |
|-------|-------------|-------------|-------------|--------|
| Display | 4.5rem (72px) | 5rem (80px) | 1.1 | Hero sections |
| H1 | 3rem (48px) | 3.375rem (54px) | 1.2 | Page titles |
| H2 | 2.25rem (36px) | 2.5rem (40px) | 1.3 | Section headers |
| H3 | 1.875rem (30px) | 2rem (32px) | 1.4 | Subsections |
| H4 | 1.5rem (24px) | 1.625rem (26px) | 1.5 | Card titles |
| Body Large | 1.125rem (18px) | 1.25rem (20px) | 1.7 | Lead text |
| Body | 1rem (16px) | 1.125rem (18px) | 1.6 | Regular text |
| Small | 0.875rem (14px) | 0.9375rem (15px) | 1.5 | Captions |
| Tiny | 0.75rem (12px) | 0.8125rem (13px) | 1.4 | Labels |

### **3.3 Font Weights**

- **Regular:** 400 - Body text, descriptions
- **Medium:** 500 - Emphasized text, buttons
- **Semibold:** 600 - Subheadings, navigation
- **Bold:** 700 - Headlines, CTAs

### **3.4 Typography Usage by Context**

| Context | Arabic Font | English Font | Notes |
|---------|------------|--------------|-------|
| **Logo** | Comfortaa | Comfortaa | Consistent brand identity |
| **H1 Titles** | Year of Camel | Space Grotesk | Distinctive, bold |
| **H2-H3 Headings** | Year of Camel | Space Grotesk | Lighter weight than H1 |
| **Card Titles** | Vazirmatn | Inter | Clean, smaller (1.25rem) |
| **Navigation** | Vazirmatn | Inter | Medium weight |
| **Body Text** | IBM Plex Sans Arabic | Plus Jakarta Sans | Optimized readability |
| **Code** | JetBrains Mono | JetBrains Mono | Monospace |

### **3.5 Font Implementation**

```css
/* Arabic Typography System */
[dir="rtl"] body,
[lang="ar"] body {
  font-family: 'IBM Plex Sans Arabic', 'Readex Pro', sans-serif;
  font-weight: 400;
  line-height: 1.8;
}

/* English Typography System */
[dir="ltr"] body,
[lang="en"] body {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

/* Logo - Universal */
header .site-title {
  font-family: 'Comfortaa', 'Quicksand', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

---

## **4. Spacing System**

### **4.1 Base Unit**
8px baseline grid for consistent spacing

### **4.2 Spacing Scale**

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}
```

### **4.3 Component Spacing**

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| Button | 12px 24px | 0 | - |
| Card | 24px | 0 0 24px 0 | - |
| Section | 64px 0 | - | 32px |
| Navigation | 16px 24px | 0 | 24px |
| Form Field | 12px 16px | 0 0 16px 0 | 8px |

---

## **5. Component Design**

### **5.1 Buttons**

```css
/* Primary Button */
.btn-primary {
  background: var(--electric-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: var(--electric-blue-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--electric-blue);
  border: 2px solid var(--electric-blue);
}

.btn-secondary:hover {
  background: var(--electric-blue);
  color: white;
}

/* Arabic Button Adjustments */
[dir="rtl"] .btn {
  font-family: var(--font-arabic);
  letter-spacing: 0;
  padding: 14px 28px;
}
```

### **5.2 Cards**

```css
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--electric-blue), var(--neon-yellow));
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Dark mode card */
.dark .card {
  background: var(--dark-surface);
  border-color: var(--dark-border);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}
```

### **5.3 Navigation**

```css
.nav-header {
  background: var(--electric-blue);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-link {
  color: white;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
}
```

### **5.4 Form Elements**

```css
.input {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--electric-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Arabic input adjustments */
[dir="rtl"] .input {
  text-align: right;
  font-family: var(--font-arabic);
}
```

---

## **6. Layout System**

### **6.1 Grid System**

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
@media (max-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(1, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(1, 1fr); }
  .md\:grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}
```

### **6.2 Breakpoints**

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

---

## **7. Animation & Interaction**

### **7.1 Transitions**

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-slower: 500ms ease;
}
```

### **7.2 Hover Effects**

```css
/* Lift effect */
.hover-lift {
  transition: transform var(--transition-base);
}
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Glow effect */
.hover-glow {
  transition: box-shadow var(--transition-base);
}
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
}

/* Scale effect */
.hover-scale {
  transition: transform var(--transition-base);
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### **7.3 Loading States**

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 2s infinite;
  background: linear-gradient(90deg, 
    var(--border) 25%, 
    rgba(255, 255, 255, 0.1) 50%, 
    var(--border) 75%);
  background-size: 200% 100%;
}
```

---

## **8. Icons & Graphics**

### **8.1 Icon System**
- Primary: Heroicons or Tabler Icons
- Size scale: 16px, 20px, 24px, 32px, 48px
- Stroke width: 1.5px (default), 2px (bold)

### **8.2 Category Icons**

| Category | Icon | Color |
|----------|------|-------|
| Tech & AI | `<cpu />` | electric-blue |
| Knowledge | `<book-open />` | lavender |
| Sports | `<activity />` | lime |
| Dammam | `<map-pin />` | teal |
| Faith | `<moon />` | slate |
| Social | `<users />` | coral |

---

## **9. Content Guidelines**

### **9.1 Voice & Tone**

**Characteristics:**
- **Knowledgeable** but not condescending
- **Curious** and explorative
- **Authentic** and personal
- **Respectful** of cultural nuances
- **Optimistic** about technology's potential

### **9.2 Writing Style**

| Context | Style | Example |
|---------|-------|---------|
| Headlines | Clear, intriguing | "When AI Meets Arabian Nights" |
| Body text | Conversational, informative | "Let's explore how..." |
| CTAs | Direct, action-oriented | "Start Your Journey" |
| Technical | Precise, accessible | "This function returns..." |

### **9.3 Bilingual Content Rules**

1. **Arabic First:** Default to Arabic with English as secondary
2. **Separate Blocks:** Don't mix languages mid-sentence
3. **Cultural Adaptation:** Translate meaning, not just words
4. **RTL/LTR:** Ensure proper directional formatting

---

## **10. Accessibility Standards**

### **10.1 Color Contrast**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### **10.2 Focus States**

```css
*:focus-visible {
  outline: 2px solid var(--electric-blue);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### **10.3 Screen Reader Support**
- Semantic HTML elements
- ARIA labels for icons
- Skip navigation links
- Proper heading hierarchy

---

## **11. Dark Mode Specifications**

### **11.1 Color Mappings**

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | #FAFAFA | #0A0A0A |
| Surface | #FFFFFF | #18181B |
| Text Primary | #0F172A | #FAFAFA |
| Text Secondary | #475569 | #A1A1AA |
| Electric Blue | #0EA5E9 | #38BDF8 |
| Borders | #E2E8F0 | #27272A |

### **11.2 Implementation**

```css
/* Automatic dark mode based on system preference */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode variables */
  }
}

/* Manual dark mode toggle */
html.dark {
  /* Dark mode variables */
}
```

---

## **12. File Naming Conventions**

### **12.1 Assets**
- Images: `category-description-size.jpg` (e.g., `tech-ai-hero-1920.jpg`)
- Icons: `icon-name-size.svg` (e.g., `icon-cpu-24.svg`)
- Fonts: `FontName-Weight.woff2` (e.g., `AlNaseeb-Bold.woff2`)

### **12.2 Components**
- PascalCase: `ComponentName.astro`
- Props interfaces: `IComponentNameProps`
- Styles: `ComponentName.module.css`

---

## **13. Performance Guidelines**

### **13.1 Image Optimization**
- Format: WebP with JPG fallback
- Sizes: Responsive images with srcset
- Loading: Lazy load below the fold
- Quality: 85% for photos, 95% for graphics

### **13.2 Font Loading**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" href="/fonts/AlNaseeb-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### **13.3 CSS Performance**
- Critical CSS inline
- Non-critical CSS deferred
- Remove unused styles
- Minify production CSS

---

## **14. Implementation Checklist**

### **Phase 1: Foundation**
- [ ] Install AlNaseeb font files
- [ ] Update color variables in Tailwind config
- [ ] Configure typography scale
- [ ] Set up dark mode toggle

### **Phase 2: Components**
- [ ] Update button styles
- [ ] Redesign cards with gradient accent
- [ ] Implement new navigation
- [ ] Style form elements

### **Phase 3: Content**
- [ ] Apply category colors to tags
- [ ] Update heading hierarchy
- [ ] Implement bilingual toggle
- [ ] Add loading states

### **Phase 4: Polish**
- [ ] Add hover animations
- [ ] Implement focus states
- [ ] Test accessibility
- [ ] Optimize performance

---

## **15. Brand Applications**

### **15.1 Social Media**
- Profile image: Electric blue gradient monogram
- Cover: Abstract dune pattern with electric accents
- Post templates: Category-colored borders

### **15.2 Email Signature**

```html
<div style="font-family: Inter, sans-serif;">
  <strong style="color: #0EA5E9;">Abdullah Al-Thani</strong><br>
  <span style="color: #475569;">Technology Consultant & Digital Creator</span><br>
  <a href="https://abdla.box" style="color: #14B8A6;">abdla.box</a>
</div>
```

### **15.3 Business Card**
- Front: Name in AlNaseeb (Arabic) and Inter (English)
- Back: Electric blue to neon yellow gradient
- QR code: Links to abdla.box

---

*Last updated: January 2025*  
*Version: 2.0*