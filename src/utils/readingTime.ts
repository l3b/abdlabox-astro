
export function getReadingTime(content: string, wordsPerMinute = 200) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}
