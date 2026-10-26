import { createClient } from './browserClient';
import { type QueryData } from '@supabase/supabase-js';

export const getHomePosts = async (
  supabase: ReturnType<typeof createClient>,
) => {
  return await supabase
    .from('td_post')
    .select(
      'id, created_at, post_title, post_content, post_slug, post_img, post_author("id","user_name"),td_comments(count)',
    )
    .order('created_at', { ascending: false });
};

export const getSinglePost = async (slug: string) => {
  const supabase = createClient();
  return await supabase
    .from('td_post')
    .select(
      'id, post_title, post_content,post_img, post_author("id","user_name")',
    )
    .eq('post_slug', slug)
    .single();
};

export const getSearchResult = async (searchQuery: string) => {
  const supabase = createClient();
  return await supabase
    .from('td_post')
    .select('id, post_title, post_content, post_slug')
    .textSearch('post_title', searchQuery);
};

export const getPostComments = async (postId: string) => {
  const supabase = await createClient();
  return await supabase
    .from('td_comments')
    .select('id, comment_content, comment_user_id("id","user_name")')
    .eq('comment_post_id', postId)
    .order('created_at', { ascending: false });
};

// export const getPostCommentsCount = async (postId: string) => {
//   const supabase = await createClient();
//   const { count, error } = await supabase
//     .from('td_comments')
//     .select('id', { count: 'exact', head: true })
//     .eq('comment_post_id', postId);

//   return { count: count ?? 0, error };
// };
export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchResultType = QueryData<ReturnType<typeof getSearchResult>>;
export type PostCommentsType = QueryData<ReturnType<typeof getPostComments>>;
