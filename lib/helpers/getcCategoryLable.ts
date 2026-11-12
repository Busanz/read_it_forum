import { POST_CATEGORIES } from '@/app/(post)/create/post-categories';

export const getCategoryLable = (value: string) => {
  return (
    POST_CATEGORIES.find((catValue) => catValue.value === value)?.label ?? value
  );
};
