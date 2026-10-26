'use server';

import { createClient } from '@/lib/supabase/serverClient';
// import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import z from 'zod';
import { createPostSchema } from './schema';
import { generateSlug } from '@/lib/helpers/slugify';
import { uploadImage } from '@/lib/supabase/upload-image';

export const CreatePostAction = async (
  userdata: z.infer<typeof createPostSchema>,
) => {
  const parsedData = createPostSchema.parse(userdata);
  const postSlug = generateSlug(parsedData.post_title);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const imageFile = userdata.post_img?.get('post_img');
  if (
    !(imageFile instanceof File) &&
    imageFile !== null &&
    imageFile !== 'undefined'
  ) {
    throw Error('Image is not in valid format');
  }

  const imageUrl =
    imageFile && imageFile !== 'undefined'
      ? await uploadImage(imageFile)
      : null;

  const { data, error } = await supabase.from('td_post').insert({
    ...userdata,
    post_slug: postSlug,
    post_img: imageUrl,
    post_author: user.id,
  });
  // console.log('Create new post', data);
  if (error) throw error;

  // revalidatePath('/');
  redirect(`/${postSlug}`);
};
