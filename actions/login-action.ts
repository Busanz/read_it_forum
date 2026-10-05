'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
// import { logInSchema } from './schemas';
// import z from 'zod';

export const LogInAction = async (formdata: FormData) => {
  // userdata: z.infer<typeof logInSchema>;
  const userdata = {
    email: formdata.get('fieldgroup-email') as string,
    password: formdata.get('password') as string,
  };

  // const parsedData = logInSchema.parse(userdata);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(userdata);
  if (error) throw error;
  redirect('/');
};
