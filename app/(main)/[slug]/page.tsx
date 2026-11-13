import { getPostComments, getSinglePost } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';

import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import Comments from '@/components/layout/Comments';
import AddComment from './AddComment';
import PostCard from '@/components/layout/PostCard';
import { Card, CardHeader } from '@/components/ui/card';

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: singlePost, error: singlePostError } =
    await getSinglePost(slug);
  if (singlePostError) throw singlePostError;

  const isAuthor: boolean =
    singlePost && user && user.id === singlePost.post_author.id ? true : false;

  const { data: comments, error: commentsError } = await getPostComments(
    singlePost.id,
  );
  if (commentsError) throw commentsError;

  return (
    <section className="flex flex-col items-center w-full max-w-5xl py-10 md:py-10 px-2 md:px-10 my-10 bg-linear-to-r/srgb from-[#3000a075] to-[#0079bf97] rounded-none lg:rounded-lg">
      {singlePost && (
        <>
          <PostCard
            post_id={singlePost.id}
            post_category={singlePost.post_category!}
            post_content={singlePost.post_content || ''}
            post_title={singlePost.post_title}
            post_img={singlePost.td_image.map((img) => img.image_url)}
            post_author={singlePost.post_author.user_name}
            created_at={singlePost.created_at}
            post_comment_count={comments.length ?? 0}
            isSlugPage={true}
          />

          <Card className="relative mx-auto w-full mb-4">
            <CardHeader>
              <div>
                {comments && (
                  <Comments
                    comments={comments}
                    isAuthor={isAuthor}
                    currentUser={user ? user.id : null}
                    postId={singlePost.id}
                  />
                )}
              </div>
              {user && <AddComment postId={singlePost.id} />}
            </CardHeader>
          </Card>

          {isAuthor && (
            <div className="flex w-full justify-end gap-5 pt-3">
              <DeleteButton id={singlePost.id} />
              <EditButton currentPostSlug={slug} />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PostPage;
