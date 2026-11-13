import { POST_CATEGORIES } from '@/app/(post)/create/post-categories';
import PostCard from '@/components/layout/PostCard';
import { Separator } from '@/components/ui/separator';
import { getSearchResult } from '@/lib/supabase/queries';

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) => {
  const { query, category } = await searchParams;
  const { data: searchResult, error } = await getSearchResult({
    query,
    category,
  });
  if (error) throw error;
  const categoryLabel = POST_CATEGORIES.find(
    (item) => item.value === category,
  )?.label;

  return (
    <section className="flex flex-col items-center w-full max-w-5xl py-5 md:py-6 mx-2 px-4 md:px-10 my-10 bg-linear-to-r/srgb from-[#3000a075] to-[#0079bf97] lg:rounded-lg">
      <h1 className="flex flex-col sm:flex-row w-full sm:justify-start sm:items-center text-lg sm:text-2xl font-light text-header pb-3">
        Search results -
        <span className="pl-0 sm:pl-2">
          {`${String(searchResult.length).padStart(2, '0')} ${
            searchResult.length === 1 ? 'item' : 'items'
          } found`}
        </span>
        {categoryLabel && (
          <span className="pl-0 sm:pl-2">in {categoryLabel}</span>
        )}
      </h1>
      <Separator className="my-4" />
      {searchResult.length === 0 && (
        <p>No search result, try again with something...</p>
      )}
      {searchResult &&
        searchResult.map((post) => (
          <PostCard
            key={post.id}
            post_id={post.id}
            post_category={post.post_category!}
            post_content={post.post_content || ''}
            post_title={post.post_title}
            post_author={post.post_author.user_name}
            created_at={post.created_at}
            post_comment_count={post.td_comments?.[0]?.count ?? 0}
            post_slug={post.post_slug}
          />
        ))}
    </section>
  );
};

export default SearchResultPage;
