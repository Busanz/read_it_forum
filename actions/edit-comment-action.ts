'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { editCommentSchema } from './schema';
import z from 'zod';

export const EditCommentAction = async (
  userdata: z.infer<typeof editCommentSchema>,
) => {
  const parsed = editCommentSchema.parse(userdata);
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('td_comments')
    .update({
      comment_content: parsed.comment_content,
      created_at: new Date().toISOString(),
    })
    .eq('id', parsed.comment_id)
    .eq('comment_user_id', user.id)
    .select('id');

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Comment could not be updated');
  }

  revalidatePath('/');
};
