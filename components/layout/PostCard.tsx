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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TbMessage } from 'react-icons/tb';
import { truncateWords } from '@/lib/helpers/truncate-words';
import { humanizeTime } from '@/lib/helpers/humanize-time';

type CardImageProps = {
  post_content: string;
  post_title: string;
  post_img: string;
  post_author: string;
  created_at: string;
  post_comment_count: number;
};

export function PostCard({
  post_content,
  post_title,
  post_img,
  post_author,
  created_at,
  post_comment_count,
}: CardImageProps) {
  return (
    <Card className="relative mx-auto w-full mb-4">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle className="text-xl text-header font-normal">
          {post_title}
        </CardTitle>
        <div className="flex gap-3 my-3">
          <Avatar size="lg">
            <AvatarImage src="post_avatar.png" alt="@shadcn" />
            <AvatarFallback>RIT</AvatarFallback>
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
              className="relative z-20 aspect-video w-full  max-w-2xl"
            />
          )}

          <CardDescription className="font-normal text-lg pt-5">
            {truncateWords(post_content)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex font-extralight items-center">
          <TbMessage size={30} strokeWidth={0.75} />
          <p className="pl-4">
            {post_comment_count === 0
              ? 'Add comment'
              : `0${post_comment_count} ${post_comment_count === 1 ? 'discussion' : 'discussions'}`}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
