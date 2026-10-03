import { createClient } from './browserClient';
import { type QueryData } from '@supabase/supabase-js';

export const getHomePosts = async () => {
  const supabase = createClient();
  return await supabase
    .from('td_post')
    .select(
      'id, post_title, post_content, post_slug, post_author("id","user_name")',
    )
    .order('created_at', { ascending: false });
};

export const getSinglePost = async (slug: string) => {
  const supabase = createClient();
  return await supabase
    .from('td_post')
    .select('id, post_title, post_content, post_author("id","user_name")')
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
export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchResultType = QueryData<ReturnType<typeof getSearchResult>>;
