import HomePosts from '@/components/layout/HomePosts';
import { getHomePosts } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/serverClient';

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await getHomePosts(supabase);
  if (error) throw error;
  // console.log(data, error);
  return (
    <div className="flex flex-col items-center w-full max-w-5xl py-5 mt-5 bg-accent">
      <HomePosts post={data} />
    </div>
  );
}
