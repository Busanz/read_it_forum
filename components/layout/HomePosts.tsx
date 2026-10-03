'use client';

import Link from 'next/link';
import { getHomePosts, HomePostType } from '@/lib/supabase/queries';
import { useQuery } from '@tanstack/react-query';

const HomePosts = ({ post }: { post: HomePostType }) => {
  const { data } = useQuery({
    queryKey: ['home_post_key'],
    queryFn: async () => {
      const { data, error } = await getHomePosts();
      if (error) throw error;
      return data;
    },
    initialData: post,
  });
  return (
    <>
      {data &&
        data.map((post) => (
          <Link
            href={`/${post.post_slug}`}
            key={post.id}
            className="flex flex-col items-center justify-center w-full max-w-3xl p-4 mb-3 font-black border border-destructive"
          >
            {post.post_title}
            <p className="mt-4 font-extralight">{post.post_content}</p>
            <p className="mt-4 font-extralight">
              {post?.post_author?.user_name}
            </p>
          </Link>
        ))}
    </>
  );
};

export default HomePosts;
