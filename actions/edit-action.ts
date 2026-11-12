'use server';

import z from 'zod';
import { editPostSchema } from './schema';
import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/supabase/upload-image';
import { getStoragePath } from '@/lib/helpers/getStoragePath';

const IMAGE_MAX_NUM = 3;
const BUCKET = 'read_it';

export const EditPostAction = async ({
  postData,
  postId,
}: {
  postData: z.infer<typeof editPostSchema>;
  postId: string;
}) => {
  const parsedData = editPostSchema.parse(postData);
  const imageFile = parsedData.post_img ?? [];

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const { data: post, error: postError } = await supabase
    .from('td_post')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError || !post) throw new Error('Post is not available');
  if (post.post_author !== user.id) throw new Error('Unauthorized');

  const { data: currentImages, error: imagesError } = await supabase
    .from('td_image')
    .select('id, image_url')
    .eq('image_post_id', postId)
    .order('image_position', { ascending: true });

  if (imagesError) throw new Error(imagesError.message);

  const allUploadedImages = currentImages ?? [];

  const remainImages = allUploadedImages.filter((img) =>
    parsedData.keep_image_urls.includes(img.image_url),
  );

  const removedImages = allUploadedImages.filter(
    (img) => !parsedData.keep_image_urls.includes(img.image_url),
  );

  if (remainImages.length + imageFile.length > IMAGE_MAX_NUM) {
    throw new Error(`Maximum number ${IMAGE_MAX_NUM} of images exceeded`);
  }

  const newImageUrls: string[] = [];
  for (const file of imageFile) {
    newImageUrls.push(await uploadImage(file));
  }

  const { data: updatedPost } = await supabase
    .from('td_post')
    .update({
      post_title: parsedData.post_title,
      post_content: parsedData.post_content ?? null,
      post_category: parsedData.post_category,
    })
    .eq('id', postId)
    .select('post_slug')
    .single()
    .throwOnError();

  if (removedImages.length > 0) {
    const { error } = await supabase
      .from('td_image')
      .delete()
      .in(
        'id',
        removedImages.map((img) => img.id),
      );

    if (error) throw new Error(error.message);
  }

  if (remainImages.length > 0) {
    const { error: renumberError } = await supabase.from('td_image').upsert(
      remainImages.map((img, index) => ({
        id: img.id,
        image_post_id: postId,
        image_url: img.image_url,
        image_position: index + 1,
      })),
    );
    if (renumberError) throw new Error(renumberError.message);
  }

  if (newImageUrls.length > 0) {
    const { error } = await supabase.from('td_image').insert(
      newImageUrls.map((image_url, index) => ({
        image_post_id: postId,
        image_url,
        image_position: remainImages.length + index + 1,
      })),
    );
    if (error) throw new Error(error.message);
  }

  const removedImagesPaths = removedImages
    .map((url) => getStoragePath(url.image_url))
    .filter((path): path is string => path !== null);

  if (removedImagesPaths.length > 0) {
    const { error: imageError } = await supabase.storage
      .from(BUCKET)
      .remove(removedImagesPaths);

    if (imageError) throw new Error('Storege cleanup failed');
  }

  revalidatePath('/');
  revalidatePath(`/${updatedPost.post_slug}`);
  return { slug: updatedPost.post_slug };
};
