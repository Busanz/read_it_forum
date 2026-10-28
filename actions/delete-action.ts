'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const DeletePostAction = async (postId: string) => {
  const supabase = await createClient();
  await supabase.from('td_post').delete().eq('id', postId).throwOnError();
  revalidatePath('/');
  redirect('/');
};
