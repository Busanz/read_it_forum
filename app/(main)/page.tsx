import HomePosts from '@/components/layout/HomePosts';
import { getHomePosts } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';

// export const revalidation = 600;
export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);
  if (error) throw error;
  return (
    <section className="flex flex-col items-center w-full max-w-5xl py-10 md:py-10 px-4 md:px-10 mt-10 bg-linear-to-r/srgb from-[#3000a075] to-[#0079bf97] rounded-lg">
      <HomePosts post={data} />
    </section>
  );
}
