import Image from 'next/image';
import { getSinglePost } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';

import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

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

  console.log(isAuthor);
  return (
    <section className="flex flex-col w-full p-10 items-center text-white">
      {singlePost && (
        <div className="flex flex-col w-full max-w-4xl px-4 py-10 bg-red-500 ">
          <h1 className="text-2xl font-semibold pb-10">
            {singlePost.post_title}
          </h1>
          {singlePost.post_content && <p>{singlePost.post_content}</p>}
          <p className="flex w-fit ml-auto justify-end border border-white bg-amber-100/80 p-4 rounded-full">
            {singlePost.post_author.user_name}
          </p>
          <div className="pb-10">
            {singlePost.post_img && (
              <Image
                src={singlePost.post_img}
                alt={singlePost.post_title}
                width={300}
                height={300}
              />
            )}
          </div>
          {isAuthor && (
            <div className="flex items-center gap-5">
              <DeleteButton id={singlePost.id} />
              <EditButton currentPostSlug={slug} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PostPage;
