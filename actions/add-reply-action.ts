'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/serverClient';
import { commentSchema } from './schema';

export const AddReplyAction = async ({
  postId,
  parentId,
  commentData,
}: {
  postId: string;
  parentId: string;
  commentData: z.infer<typeof commentSchema>;
}) => {
  const parsed = commentSchema.parse(commentData);

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('You need to login before reply');

  const { data: parent, error: parentError } = await supabase
    .from('td_comments')
    .select('id, comment_post_id')
    .eq('id', parentId)
    .single();
  if (parentError || !parent) throw new Error('Comment not found');
  if (parent.comment_post_id !== postId) throw new Error('Invalid reply');

  const { error: insertError } = await supabase.from('td_comments').insert({
    comment_content: parsed.comment_content,
    comment_post_id: postId,
    comment_parent_id: parentId,
    comment_user_id: user.id,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath('/', 'layout');
};
