import { PostCard } from '@/components/layout/PostCard';
import { Separator } from '@/components/ui/separator';
import { getSearchResult } from '@/lib/supabase/queries';
import Link from 'next/link';

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;
  const { data: searchResult, error } = await getSearchResult(query ?? '');
  if (error) throw error;

  return (
    <section className="flex flex-col items-center w-full max-w-5xl py-5 md:py-6 mx-4 px-4 md:px-10 my-10 bg-linear-to-r/srgb from-[#3000a075] to-[#0079bf97] lg:rounded-lg">
      <h1 className="flex w-full justify-start items-center text-xl sm:text-2xl font-light text-header pb-3">
        Search results -
        <span className="pl-2">
          {`${String(searchResult.length).padStart(2, '0')} ${
            searchResult.length === 1 ? 'item' : 'items'
          } found`}
        </span>
      </h1>
      <Separator className="my-4" />
      {searchResult.length === 0 && (
        <p>No search result, try again with something...</p>
      )}
      {searchResult &&
        searchResult.map((post) => (
          <Link
            key={post.id}
            href={`/${post.post_slug}`}
            className="flex w-full"
          >
            <PostCard
              post_content={post.post_content || ''}
              post_title={post.post_title}
              post_author={post.post_author.user_name}
              created_at={post.created_at}
              post_comment_count={post.td_comments?.[0]?.count ?? 0}
            />
          </Link>
        ))}
    </section>
  );
};

export default SearchResultPage;
