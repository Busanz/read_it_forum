import { z } from 'zod';

export const logInSchema = z.object({
  email: z.email('Zod says incorrect email pattern..!'),
  password: z
    .string()
    .min(5, 'Zod says password should be at least 6 charactors'),
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
    .min(10, 'Title at least 10 charactors'),
  post_content: z.string().optional(),
  post_img: z.instanceof(FormData).optional(),
});

export const commentSchema = z.object({
  comment_content: z.string().min(3, 'Comment must be at least 03 charactors'),
});
