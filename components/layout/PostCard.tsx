import Image from 'next/image';
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

type CardImageProps = {
  post_content: string;
  post_title: string;
  post_img?: string;
  post_author: string;
  created_at: string;
  post_comment_count?: number;
  isSlugPage?: boolean;
};

export function PostCard({
  post_content,
  post_title,
  post_img,
  post_author,
  created_at,
  post_comment_count = 0,
  isSlugPage = false,
}: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full mb-4">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle className="flex w-full max-w-3xl text-lg sm:text-xl text-header font-normal pr-3 sm:pr-10">
          {post_title}
        </CardTitle>
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

        <div>
          {post_img && (
            <Image
              src={post_img}
              alt="Event cover"
              width={100}
              height={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`relative aspect-video w-full ${isSlugPage ? 'max-w-xl' : 'max-w-lg'}`}
            />
          )}

          <CardDescription className="font-normal text-base sm:text-[1.1rem] text-foreground py-5">
            {!isSlugPage ? truncateWords(post_content) : post_content}
          </CardDescription>
        </div>
      </CardHeader>

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
    </Card>
  );
}
