import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TbMessage } from 'react-icons/tb';
import { truncateWords } from '@/lib/helpers/truncate-words';
import { humanizeTime } from '@/lib/helpers/humanize-time';
import { getInitialUserName } from '@/lib/helpers/avatarInitials';
import { PostImageCarousel } from './PostImageCarousel';
import Link from 'next/link';
import { getCategoryLable } from '@/lib/helpers/getcCategoryLable';

type CardImageProps = {
  post_id: string;
  post_category: string;
  post_content: string;
  post_title: string;
  post_img?: string[];
  post_author: string;
  created_at: string;
  post_comment_count?: number;
  isSlugPage?: boolean;
  post_slug?: string;
};

const PostCard = ({
  post_id,
  post_category,
  post_content,
  post_title,
  post_img,
  post_author,
  created_at,
  post_comment_count = 0,
  isSlugPage = false,
  post_slug,
}: CardImageProps) => {
  return (
    <Card className="relative mx-auto w-full mb-4">
      <CardHeader className="flex flex-col">
        {!isSlugPage ? (
          <Link
            key={post_id}
            href={`/${post_slug}`}
            className="flex flex-col sm:flex-row w-full justify-between"
          >
            <CardTitle className="flex w-full max-w-3xl text-lg sm:text-xl text-header font-normal pr-3 sm:pr-10 order-2 sm:order-1">
              {post_title}
            </CardTitle>
            <CardAction className="flex w-fit justify-end order-1 sm:order-2 -ml-1 sm:ml-0 mb-2 sm:mb-0">
              <Badge
                variant="secondary"
                className="px-4 py-3 font-normal text-sm  bg-indigo-100"
              >
                {getCategoryLable(post_category)}
              </Badge>
            </CardAction>
          </Link>
        ) : (
          <div className="flex w-full justify-between">
            <CardTitle className="flex w-full max-w-3xl text-lg sm:text-xl text-header font-normal pr-3 sm:pr-10">
              {post_title}
            </CardTitle>
            <CardAction className="flex w-fit justify-end">
              <Badge
                variant="secondary"
                className="px-4 py-3 font-normal text-sm  bg-indigo-100"
              >
                {getCategoryLable(post_category)}
              </Badge>
            </CardAction>
          </div>
        )}

        <div className="flex gap-3 my-3">
          <Avatar size="lg">
            <AvatarFallback className="bg-indigo-200">
              {getInitialUserName(post_author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-bold text-base">{post_author}</p>
            <p>{humanizeTime(created_at)}</p>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <PostImageCarousel
            images={post_img || []}
            title={post_title}
            isSlugPage={isSlugPage}
          />

          <CardDescription className="font-normal text-base sm:text-[1.1rem] text-foreground py-5">
            {!isSlugPage ? truncateWords(post_content) : post_content}
          </CardDescription>

          {!isSlugPage && (
            <Link
              href={`/${post_slug}`}
              className="text-header underline underline-offset-2"
            >
              Read more
            </Link>
          )}
        </div>
      </CardHeader>

      {!isSlugPage ? (
        <Link
          key={post_id}
          href={`/${post_slug}`}
          className="flex w-full justify-between"
        >
          <CardFooter className="w-full">
            <div className="flex w-full font-light items-center">
              <TbMessage size={30} strokeWidth={0.75} />
              <p className="pl-2 text-header">
                {post_comment_count === 0
                  ? 'Add comment'
                  : `${String(post_comment_count).padStart(2, '0')} ${post_comment_count === 1 ? 'discussion' : 'discussions'}`}
              </p>
            </div>
          </CardFooter>
        </Link>
      ) : (
        <>
          <CardFooter>
            <div className="flex font-light items-center">
              <TbMessage size={30} strokeWidth={0.75} />
              <p className="pl-2 text-header">
                {post_comment_count === 0
                  ? 'Add comment'
                  : `${String(post_comment_count).padStart(2, '0')} ${post_comment_count === 1 ? 'discussion' : 'discussions'}`}
              </p>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default PostCard;
