import { getSearchResult } from '@/lib/supabase/queries';
import Link from 'next/link';

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;
  const { data: searchResult, error } = await getSearchResult(query ?? '');
  console.log(searchResult);
  if (error) throw error;

  return (
    <div className="flex flex-col w-full max-w-3xl p-5 bg-amber-100">
      {searchResult.length === 0 && (
        <p>No search result, try again with something...</p>
      )}
      {searchResult &&
        searchResult.map((post) => (
          <Link key={post.id} href={`/${post.post_slug}`}>
            <h1>{post.post_title}</h1>
            {post.post_content && <p>{post.post_content}</p>}
          </Link>
        ))}
    </div>
  );
};

export default SearchResultPage;
