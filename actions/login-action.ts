'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import { logInSchema } from './schema';
import z from 'zod';

export const LogInAction = async (userdata: z.infer<typeof logInSchema>) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(userdata);
  if (error) throw error;
  redirect('/');
};
