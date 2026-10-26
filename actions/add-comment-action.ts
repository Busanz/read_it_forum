'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { commentSchema } from './schema';
import z from 'zod';
import { revalidatePath } from 'next/cache';

export const AddCommentAction = async ({
  commentData,
  postId,
}: {
  commentData: z.infer<typeof commentSchema>;
  postId: string;
}) => {
  const supabase = await createClient();
  const parsedData = commentSchema.parse(commentData);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You need to login before add comment');

  await supabase
    .from('td_comments')
    .insert({
      comment_post_id: postId,
      comment_user_id: user.id,
      ...parsedData,
    })
    .throwOnError();

  revalidatePath('/');
};
