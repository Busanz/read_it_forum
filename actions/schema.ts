import { z } from 'zod';

export const logInSchema = z.object({
  email: z.email('Zod says incorrect email pattern..!'),
  password: z
    .string()
    .min(5, 'Zod says password should be at least 6 charactors'),
});

export const signUpSchema = z.object({
  email: z.email('Zod says increcct email pattern'),
  username: z
    .string()
    .min(5, 'Zod says username should be at least 5 chactors'),
  password: z
    .string()
    .min(6, 'Zod says password should be at least 5 chactors'),
});
