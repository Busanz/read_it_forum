import { PostCommentsType } from '@/lib/supabase/queries';
import { buildCommentTree, CommentNode } from '@/lib/helpers/buildCommentTree';
import CommentItem from './CommentItem';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react/jsx-runtime';

const Comments = ({
  comments,
  isAuthor,
  currentUser,
  postId,
}: {
  comments: PostCommentsType;
  isAuthor: boolean;
  currentUser: string | null;
  postId: string;
}) => {
  const commentCount: number = comments.length ?? 0;
  const commnetTree: CommentNode[] = buildCommentTree(comments);

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

      <div className="flex flex-col">
        {commnetTree.map((comment, index) => (
          <Fragment key={comment.id}>
            <CommentItem
              comment={comment}
              isAuthor={isAuthor}
              currentUser={currentUser}
              postId={postId}
              depth={0}
            />
            {index < commnetTree.length - 1 && (
              <Separator className="mt-6 mb-4" />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default Comments;
