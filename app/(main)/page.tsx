import HomePosts from '@/components/layout/HomePosts';
import { getHomePosts } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';

// export const revalidation = 600;
export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);
  if (error) throw error;
  // console.log(data, error);
  return (
    <section className="flex flex-col items-center w-full max-w-4xl py-5 md:py-10 px-4 md:px-10 mt-5 bg-foreground/10">
      <HomePosts post={data} />
    </section>
  );
}
