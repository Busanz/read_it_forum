export const generateSlug = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_/]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
  return slug;
};
