'use client';

import DeleteCommentButton from '@/app/(main)/[slug]/DeleteCommentButton';
import EditComment from '@/app/(main)/[slug]/EditComment';
import ReplyComment from '@/app/(main)/[slug]/ReplyComment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CardDescription, CardFooter } from '@/components/ui/card';
import { getInitialUserName } from '@/lib/helpers/avatarInitials';
import { humanizeTime } from '@/lib/helpers/humanize-time';
import type { CommentNode } from '@/lib/helpers/buildCommentTree';
import { VscKebabVertical } from 'react-icons/vsc';
import { useState } from 'react';

type CommentItemProps = {
  comment: CommentNode;
  isAuthor: boolean;
  currentUser: string | null;
  postId: string;
  depth?: number;
};

const CommentItem = ({
  comment,
  isAuthor,
  currentUser,
  postId,
  depth = 0,
}: CommentItemProps) => {
  const [showButtons, setShowButton] = useState(false);
  const handleClick = () => {
    setShowButton(!showButtons);
  };
  return (
    <div className="w-full">
      <div className="flex w-full flex-col bg-header/5 px-3 pt-3 rounded-xl text-black mt-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
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
          <div
            onClick={handleClick}
            className={`p-2 cursor-pointer transition-transform duration-300 ease-in-out ${showButtons ? 'rotate-90' : 'rotate-0'}`}
          >
            <VscKebabVertical size={20} strokeWidth={1} />
          </div>
        </div>
        <CardDescription className="py-4 px-2 mb-4 rounded-lg text-base sm:text-[1.1rem] text-foreground">
          {comment.comment_content}
        </CardDescription>

        {(currentUser || isAuthor) && showButtons && (
          <CardFooter className="flex w-full flex-wrap justify-end gap-1 px-0 py-1">
            {(isAuthor || currentUser === comment.comment_user_id.id) && (
              <>
                <DeleteCommentButton
                  commentId={comment.id}
                  setShowButton={setShowButton}
                />
                <EditComment
                  commentId={comment.id}
                  commentContent={comment.comment_content}
                  setShowButton={setShowButton}
                />
              </>
            )}
            {currentUser && (
              <ReplyComment
                commentId={comment.id}
                postId={postId}
                setShowButton={setShowButton}
              />
            )}
          </CardFooter>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div className={depth < 3 ? 'ml-2 pl-1 border-l' : 'border-none pl-1'}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isAuthor={isAuthor}
              currentUser={currentUser}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CommentItem;
