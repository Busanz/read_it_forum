'use server';

import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const imageFiles = parsedData.post_img ?? [];

  if (!imageFiles.every((imageFile) => imageFile instanceof File)) {
    throw Error('Image is not in valid format');
  }

  const { data: post, error } = await supabase
    .from('td_post')
    .insert({
      post_title: parsedData.post_title,
      post_content: parsedData.post_content,
      post_category: parsedData.post_category,
      post_slug: postSlug,
      post_author: user.id,
    })
    .select('id')
    .single();
  if (error) throw error;

  if (imageFiles.length > 0) {
    try {
      const imageUrls: string[] = [];
      for (const imageFile of imageFiles) {
        imageUrls.push(await uploadImage(imageFile));
      }
      const { error: imageError } = await supabase.from('td_image').insert(
        imageUrls.map((image_url, image_position) => ({
          image_post_id: post.id,
          image_url,
          image_position: image_position + 1,
        })),
      );
      if (imageError) throw imageError;
    } catch (uploadError) {
      await supabase.from('td_post').delete().eq('id', post.id);
      throw new Error(
        uploadError instanceof Error
          ? uploadError.message
          : 'Image upload failed',
      );
    }
  }

  revalidatePath('/');
  return { slug: postSlug };
};
