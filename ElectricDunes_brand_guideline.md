# **Abdla Brand Guideline — Electric Dunes Identity (Updated)**

---

## **1. Brand Essence**

**Brand Name**

- **English:** Abdla
- **Arabic:** عبدالله
- **Pronunciation:** /ʕabdalla/

**Base of Operations:** Dammam, Saudi Arabia

**Tagline:**

- English: *"Where knowledge meets curiosity"*
- Arabic: «حيث يلتقي العلم بالفضول»

**Brand Archetype:** **The Sage** (Wisdom & Insight) blended with **The Creator** (Innovation & Vision)

**Narrative:**\
Abdla is a personal brand built at the intersection of **technology, culture, and curiosity**. It draws on a decade of leadership in digital transformation, AI adoption, and knowledge management. Through content, tools, and conversations, Abdla bridges local and global perspectives — inspiring people to think deeper, live smarter, and connect meaningfully.

**Mission:** Share knowledge, inspire curiosity, and build meaningful conversations through tech, culture, faith, and personal growth.

---

## **2. Brand Values**

| Value                   | Description                                    | Application                                                     |
| ----------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| **Innovation**          | Constantly explore and adopt new technologies. | Use cutting-edge visuals, emerging tech in web/app experiences. |
| **Authenticity**        | Honest voice, no over-polished façades.        | Real photography, conversational tone.                          |
| **Community**           | Building networks & dialogue.                  | Interactive elements, bilingual accessibility.                  |
| **Personal Growth**     | Continuous self-development and learning.      | Educational content, resource sharing.                          |
| **Cultural Connection** | Respect and embrace local identity.            | Arabic-first layouts, regional patterns, typography choices.    |

---

## **3. Content Categories**

| Category             | English Label | Arabic Label              | Color Code          |
| -------------------- | ------------- | ------------------------- | ------------------- |
| Technology & AI      | Tech & AI     | التقنية والذكاء الاصطناعي | Electric Blue       |
| Knowledge Management | Knowledge     | إدارة المعرفة             | Lavender            |
| Running & Sports     | Sports        | الرياضة والجري            | Lime                |
| Dammam Diaries       | Dammam        | يوميات الدمام             | Teal                |
| Islamic Reflections  | Faith         | تأملات إسلامية            | Charcoal/Near Black |
| Life & Society       | Social        | الحياة والمجتمع           | Coral               |

---

## **4. Color System: Electric Dunes**

### **Primary Colors**

| Role          | HEX     | Usage                                     |
| ------------- | ------- | ----------------------------------------- |
| Electric Blue | #008BDE | Main brand accent, links, primary buttons |
| Neon Yellow   | #FFE600 | Highlights, call-to-action                |

### **Secondary Colors**

| Role     | HEX     | Usage                                    |
| -------- | ------- | ---------------------------------------- |
| Teal     | #46C3B8 | Dammam category, calm accents            |
| Lavender | #8F5CCC | Knowledge category, secondary highlights |

### **Neutrals**

| Role            | HEX     | Usage                            |
| --------------- | ------- | -------------------------------- |
| Cool Light Gray | #F5F8FA | Backgrounds                      |
| Soft Charcoal   | #1E2430 | Body text, dark mode backgrounds |

### **Extra Accents**

| Role       | HEX     | Usage                 |
| ---------- | ------- | --------------------- |
| Coral Red  | #FF6961 | Fun/social highlights |
| Lime Green | #CCFF66 | Sports category       |

---

### **Developer Tokens**

```css
:root {
  --electric-blue: #008BDE;
  --neon-yellow: #FFE600;
  --teal: #46C3B8;
  --lavender: #8F5CCC;
  --near-white: #F5F8FA;
  --near-black: #1E2430;
  --coral: #FF6961;
  --lime: #CCFF66;
}
```

---

## **5. Typography**

**English Typeface:** **Poppins**

- Headers: Bold / Semibold
- Body: Regular

**Arabic Typeface:** **AlNaseeb (خط النسيب)** — [Font Source](https://engage.moc.gov.sa/e/fonts/alnaseeb-font)

- Headers: Bold weight for section titles and category labels.
- Body: Regular for paragraphs, keeping 1.6 line-height for readability.

**Usage Rules:**

- Default site language is **Arabic**, with English translations accessible via toggle.
- Arabic headers should be slightly larger than English for visual balance.
- Avoid mixing Arabic and English in the same line unless necessary. If mixed, use proportional spacing adjustments.

---

## **6. Logo System**

**Primary Logo:**

- Wordmark "Abdla" in Electric Blue (Poppins Bold)
- Optional Neon Yellow underline or dot accent

**Arabic Version:**

- عبدالله in AlNaseeb Bold, paired or standalone

**Variants:**

- Full Color (primary use)
- Monochrome for dark/light backgrounds
- Circular monogram (A / عبدالله initial) for avatars and favicons

**Clear Space:** Equal to the height of the “A” or Arabic letter "ع".

---

## **7. Layout & UI Guidelines**

**Grid System:**

- 12-column responsive grid for desktop
- Mobile-first breakpoints at 768px and 480px

**Spacing:**

- 8px baseline grid
- Padding inside sections: 32–64px depending on screen size

**Component Guidelines:**

- Buttons: Rounded 8px, Electric Blue background, Neon Yellow hover state
- Links: Electric Blue text with underline on hover
- Cards: Near White background, soft shadow, category color label
- Navigation: Fixed top bar in Electric Blue, white logo, category dropdowns in their respective colors

---

## **8. Visual Elements**

**Photography Style:**

- Clean, natural light
- Futuristic architecture, urban Saudi landscapes
- People in candid, authentic moments

**Illustration Style:**

- Geometric shapes inspired by dunes, waves, and circuitry
- Minimal line art with Electric Dunes palette overlays

**Patterns & Graphics:**

- Circuit-inspired dune waves as section dividers
- Electric Blue gradient backgrounds for banners

---

## **9. Voice & Tone Guide**

**General:** Insightful, calm, energetic. Personal yet professional.

**Examples:**

- **Social Post:** "AI is reshaping how we learn. The question isn’t when — it’s how fast we adapt." / «الذكاء الاصطناعي يعيد تشكيل طريقة تعلمنا، والسؤال ليس متى، بل كم سنكون مستعدين للتأقلم.»
- **Blog Headline:** "From Dammam to the Cloud: A Journey in Knowledge Sharing"
- **Consulting Slide:** "Unlock organizational intelligence with structured knowledge systems."

---

## **10. Brand Applications**

**Social Media:**

- Consistent handles: @Abdla.box or abdla.eth
- Profile photo: Monogram in Electric Blue
- Story highlight covers in category colors

**Web:**

- Home
- Blog (category-colored post tags)
- About
- Contact form + scheduling integration (Calendly)
- Dark mode support

**Print & Presentation:**

- Business cards: White front, Electric Blue back, bilingual layout
- Deck templates: Electric Blue titles, Neon Yellow callouts, Near White backgrounds

---

## **11. Web3 Integration (Optional)**

- ENS Domain: `abdla.eth`
- IPFS Hosting for content backup
- Token-gated premium articles or courses

---

## **12. Sample HTML Component**

```html
<button class="cta-btn">ابدأ الآن</button>

<style>
.cta-btn {
  background-color: var(--electric-blue);
  color: var(--near-white);
  font-family: 'AlNaseeb', sans-serif;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.cta-btn:hover {
  background-color: var(--neon-yellow);
  color: var(--near-black);
}
</style>
```

