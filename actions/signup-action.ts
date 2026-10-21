'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import { signUpSchema } from './schema';
import z from 'zod';

export const SignUpAction = async (userdata: z.infer<typeof signUpSchema>) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userSignUpError,
  } = await supabase.auth.signUp(userdata);

  if (userSignUpError) throw userSignUpError;

  if (user && user.email) {
    const { error: insertSignUpUserError } = await supabase
      .from('td_users')
      .insert({
        id: user.id,
        email_address: user.email,
        user_name: userdata.username,
      });
    if (insertSignUpUserError) throw insertSignUpUserError;
  }
  redirect('/');
};
