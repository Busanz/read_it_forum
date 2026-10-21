export const truncateWords = (text: string, maxWords = 25) => {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(' ') + '...';
};
