import { getSinglePost } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import EditPostForm from './form';

const EditPostPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getSinglePost(slug);
  if (error) throw error;

  if (user && data && user.id !== data.post_author.id) redirect('/');
  return (
    <section className="flex flex-col w-full items-center">
      {data && (
        <>
          <h1>Edit Post: {data.post_title}</h1>
          <EditPostForm
            initialValues={{
              post_title: data.post_title,
              post_content: data.post_content,
              post_img: data.post_img,
            }}
            postId={data.id}
          />
        </>
      )}
    </section>
  );
};

export default EditPostPage;
