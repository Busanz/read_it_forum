'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';

export const DeleteCommentAction = async (commentId: string) => {
  const supabase = await createClient();
  await supabase
    .from('td_comments')
    .delete()
    .eq('id', commentId)
    .throwOnError();

  revalidatePath('/');
};
