'use server';

import z from 'zod';
import { createPostSchema } from './schema';
import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/supabase/upload-image';

export const EditPostAction = async ({
  postData,
  postId,
}: {
  postData: z.infer<typeof createPostSchema>;
  postId: string;
}) => {
  const parsedData = createPostSchema.parse(postData);
  const supabase = await createClient();

  const imageFile = postData.post_img?.get('post_img');

  const { data: post, error } = await supabase
    .from('td_post')
    .select('*')
    .eq('id', postId)
    .single();

  if (!post) throw new Error('Post does not available..!');
  if (error) throw error;

  let post_imgeUrl;
  if (typeof imageFile !== 'undefined') {
    if (!(imageFile instanceof File) && imageFile !== null) {
      throw Error('Image is not in valid format');
    }
    post_imgeUrl = imageFile ? await uploadImage(imageFile) : null;
  } else {
    post_imgeUrl = post.post_img;
  }

  const { data: updatedPost } = await supabase
    .from('td_post')
    .update({ ...parsedData, post_img: post_imgeUrl })
    .eq('id', postId)
    .select('post_slug')
    .single()
    .throwOnError();

  revalidatePath('/');
  redirect(`/${updatedPost.post_slug}`);
};
