import DeleteCommentButton from '@/app/(main)/[slug]/DeleteCommentButton';
import { PostCommentsType } from '@/lib/supabase/queries';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getInitialUserName } from '@/lib/helpers/avatarInitials';
import { humanizeTime } from '@/lib/helpers/humanize-time';
import { CardDescription, CardFooter } from '../ui/card';

const Comments = ({
  comments,
  isAuthor,
  currentUser,
}: {
  comments: PostCommentsType;
  isAuthor: boolean;
  currentUser: string | null;
}) => {
  const commentCount: number = comments.length ?? 0;
  return (
    <>
      <h2 className="text-base sm:text-lg font-medium pb-2">
        <span className="mr-2">
          {commentCount > 1 ? 'Discussions' : 'Discussion'}
        </span>
        {String(commentCount).padStart(2, '0')}
      </h2>

      {commentCount === 0 && (
        <p className="pt-2 font-light">Add the first comment for the post</p>
      )}
      {comments && (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col bg-header/5 px-4 pt-5 rounded-xl text-black mt-2"
            >
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarFallback className="bg-indigo-200">
                    {getInitialUserName(comment.comment_user_id.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-bold text-base">
                    {comment.comment_user_id.user_name}
                  </p>
                  <p>{humanizeTime(comment.created_at)}</p>
                </div>
              </div>
              <CardDescription className="py-4 px-2 mb-4 rounded-lg text-base sm:sm:text-[1.1rem] text-foreground">
                {comment.comment_content}
              </CardDescription>

              {(isAuthor || currentUser === comment.comment_user_id.id) && (
                <CardFooter className="flex w-full justify-end">
                  <DeleteCommentButton commentId={comment.id} />
                </CardFooter>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Comments;
