'use server';

import { getStoragePath } from '@/lib/helpers/getStoragePath';
import { createClient } from '@/lib/supabase/serverClient';
import { revalidatePath } from 'next/cache';

const BUCKET = 'read_it';

export const DeletePostAction = async (postId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) throw new Error('Unauthorized');

  const { data: post, error: postError } = await supabase
    .from('td_post')
    .select('id, post_author')
    .eq('id', postId)
    .single();
  if (postError || !post) throw new Error('Post is not available');
  if (post.post_author !== user.id) throw new Error('Unauthorized');

  const { data: imageUrls, error: imagesError } = await supabase
    .from('td_image')
    .select('image_url')
    .eq('image_post_id', postId);
  if (imagesError) throw new Error(imagesError.message);

  const { data: deleted, error: deleteError } = await supabase
    .from('td_post')
    .delete()
    .eq('id', postId)
    .select('id');

  if (deleteError) throw new Error(deleteError.message);
  if (!deleted || deleted.length === 0) {
    throw new Error('Post could not be deleted');
  }

  const bucketPaths = (imageUrls ?? [])
    .map((url) => getStoragePath(url.image_url))
    .filter((path): path is string => path !== null);

  if (bucketPaths.length > 0) {
    const { data, error: bucketError } = await supabase.storage
      .from(BUCKET)
      .remove(bucketPaths);
    if (bucketError) throw new Error('Storege cleanup failed');
    console.log(data);
  }

  revalidatePath('/');
};
