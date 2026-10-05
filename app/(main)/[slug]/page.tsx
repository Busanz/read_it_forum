import { getSinglePost } from '@/lib/supabase/queries';

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const { data: singlePost, error } = await getSinglePost(slug);

  if (error) throw error;
  return (
    <div className="flex flex-col w-full max-w-3xl p-10 text-white bg-accent-foreground">
      {singlePost && (
        <div>
          <h1 className="text-2xl font-semibold pb-10">
            {singlePost.post_title}
          </h1>
          {singlePost.post_content && <p>{singlePost.post_content}</p>}
          <p className="flex w-fit ml-auto justify-end border border-white bg-amber-100/80 p-4 rounded-full">
            {singlePost.post_author.user_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostPage;
