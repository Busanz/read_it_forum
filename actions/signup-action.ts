'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
// import { signUpSchema } from './schemas';
// import z from 'zod';

// export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {
export const SignUpAction = async (formdata: FormData) => {
  // formdata: FormData
  const userdata = {
    email: formdata.get('fieldgroup-email') as string,
    password: formdata.get('password') as string,
    // username: formdata.get('fieldgroup-name') as string,
    options: {
      data: {
        username: formdata.get('fieldgroup-name') as string,
      },
    },
  };

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
        user_name: userdata.options.data.username,
      });
    if (insertSignUpUserError) throw insertSignUpUserError;
  }
  redirect('/');
};
