import { getSinglePost } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';
import { redirect } from 'next/navigation';
import EditPostForm from './form';

const EditPostPage = async ({ params }: { params: { slugEdit: string } }) => {
  const { slugEdit } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getSinglePost(slugEdit);
  if (error) throw error;

  if (user && data && user.id !== data.post_author.id) redirect('/');
  return (
    <section className="relative flex flex-1 flex-col w-full items-center px-4 pt-2 pb-10 bg-[url('/bg-hero.jpg')] bg-cover bg-center bg-no-repeat isolate">
      <div className="absolute flex flex-1 w-full z-50 bg-linear-to-r/srgb from-[#440773ba] to-[#0088a0ca] top-0 left-0 h-full" />

      {data && (
        <>
          <h1 className="text-2xl sm:text-3xl font-extralight py-10 z-100 text-secondary text-center px-3">
            Edit Post: {data.post_title}
          </h1>
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
