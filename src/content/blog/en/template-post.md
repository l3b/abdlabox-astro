
---
title: "Your Blog Post Title Here"
description: "A brief description of your blog post that will appear in search results and social media previews."
featuredImage: 
  url: "/images/blog/your-featured-image.jpg"  # For local images in public/images/blog/
  # r2Path: "your-image.jpg"  # Uncomment this for R2 images instead of url
  alt: "Descriptive alt text for accessibility"
  caption: "Optional caption that appears below the image"
pubDate: 2025-05-01  # Use YYYY-MM-DD format
updatedDate: 2025-05-02  # Optional: Use if you update the post later
author: "Abdla"  # Optional: defaults to "Abdla"
language: "en"  # "en" for English, "ar" for Arabic
translationKey: "unique-post-key"  # Optional: same key for both language versions
tags: ["technology", "web-development", "astro"]  # Optional: array of tags
isDraft: true  # Set to false when ready to publish
---

# Your Main Heading

This is your blog post content written in Markdown. You can use all standard Markdown formatting.

## Subheading

Here's a paragraph with some **bold text** and *italic text*.

### Code Examples

```javascript
// Example code block
function greetUser(name) {
  console.log(`Hello, ${name}!`);
}

greetUser("World");
```

### Images

You can include inline images in several ways:

**Local images (stored in public/images/blog/):**
![Alt text](/images/blog/your-inline-image.jpg)

**External images:**
![Alt text](https://example.com/image.jpg)

**Images with captions using HTML:**
<figure>
  <img src="/images/blog/image-with-caption.jpg" alt="Descriptive alt text" />
  <figcaption>This caption will appear below the image</figcaption>
</figure>

**R2 optimized images (using OptimizedImage component):**
<!-- Note: You'll need to import and use the OptimizedImage component in .astro files -->

### Lists

**Unordered list:**
- First item
- Second item
- Third item

**Ordered list:**
1. First step
2. Second step
3. Third step

### Links

[Link to external site](https://example.com)
[Link to another post](/en/blog/another-post)

### Blockquotes

> This is a blockquote. Use it for emphasizing important points or quoting other sources.

---

**Template Notes:**
- Set `isDraft: false` when ready to publish
- Use either `url` OR `r2Path` for featuredImage, not both
- The `translationKey` should be the same for both English and Arabic versions
- Tags will automatically be processed and linked to tag pages
- PubDate and updatedDate use YYYY-MM-DD format
- Remove any frontmatter fields you don't need
