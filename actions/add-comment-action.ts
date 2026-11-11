'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/serverClient';
import { commentSchema } from './schema';

export const AddCommentAction = async ({
  postId,
  commentData,
}: {
  postId: string;
  commentData: z.infer<typeof commentSchema>;
}) => {
  const parsed = commentSchema.parse(commentData);

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    throw new Error('You need to login before add comment');

  const { error: insertError } = await supabase.from('td_comments').insert({
    comment_content: parsed.comment_content,
    comment_post_id: postId,
    comment_user_id: user.id,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath('/');
};
