import { z } from 'zod';
import { POST_CATEGORIES } from '@/app/(post)/create/post-categories';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const CATEGORY_VALUES: string[] = POST_CATEGORIES.map(
  (catItem) => catItem.value,
);

export const logInSchema = z.object({
  email: z.email('Incorrect email pattern..!'),
  password: z.string().min(5, 'Password should be at least 6 charactors'),
});

export const signUpSchema = z
  .object({
    username: z.string().min(5, {
      message: 'Username must be at least 5 characters.',
    }),
    email: z.email('This is not a valid email.'),
    password: z
      .string('Password is required')
      .min(6, 'Password must have at least 6 characters')
      .max(32, 'Password must be up to 32 characters')
      .regex(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,20}$',
        ),
        'Password must contain at least 1 small letter, 1 capital letter, 1 number and 1 special character',
      ),
    confirmPassword: z
      .string('Confirm your password is required')
      .min(6, 'Password must have at least 6 characters')
      .max(20, 'Password must be up to 20 characters'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password and Confirm Password doesn't match!",
    path: ['confirmPassword'],
  });

export const createPostSchema = z.object({
  post_title: z
    .string('Title is required')
    .min(10, 'Title at least 10 characters'),
  post_content: z.string().optional(),
  post_category: z
    .string('Category is required')
    .min(1, 'Select a category')
    .refine((value) => CATEGORY_VALUES.includes(value), 'Invalid Category'),

  post_img: z
    .array(z.instanceof(File))
    .max(3, 'You can upload a maximum of 3 images')
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'Image size must be under 5MB',
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_TYPES.includes(file.type)),
      'Only JPEG, JPG, PNG or WebP images are allowed',
    )
    .optional(),
});
export const editPostSchema = createPostSchema.extend({
  keep_image_urls: z.array(z.string()),
});

export const commentSchema = z.object({
  comment_content: z.string().min(3, 'Comment must be at least 03 charactors'),
});

export const editCommentSchema = commentSchema.extend({
  comment_id: z.string(),
});
