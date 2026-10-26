'use client';

import Link from 'next/link';
import { getHomePosts, HomePostType } from '@/lib/supabase/queries';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/browserClient';
import { PostCard } from './PostCard';

const HomePosts = ({ post }: { post: HomePostType }) => {
  const supabase = createClient();
  const { data } = useQuery({
    queryKey: ['home_post_key'],
    queryFn: async () => {
      const { data, error } = await getHomePosts(supabase);
      if (error) throw error;
      return data;
    },
    initialData: post,
  });

  return (
    <>
      {data &&
        data.map((post) => (
          <Link key={post.id} href={`/${post.post_slug}`} className="w-full">
            <PostCard
              post_content={post.post_content || ''}
              post_title={post.post_title}
              post_img={post.post_img || ''}
              post_author={post.post_author.user_name}
              created_at={post.created_at}
              post_comment_count={post.td_comments?.[0]?.count ?? 0}
            />
          </Link>
        ))}
    </>
  );
};

export default HomePosts;
