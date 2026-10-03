import Link from 'next/link';
import { HomePostType } from '@/lib/supabase/queries';

const HomePosts = ({ post }: { post: HomePostType }) => {
  return (
    <>
      {post &&
        post.map((post) => (
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
