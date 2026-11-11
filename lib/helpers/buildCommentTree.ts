import type { PostCommentsType } from '@/lib/supabase/queries';

export type CommentNode = PostCommentsType[number] & {
  replies: CommentNode[];
};

export const buildCommentTree = (
  comments: PostCommentsType,
  parentId: string | null = null,
): CommentNode[] =>
  comments
    .filter((comment) => comment.comment_parent_id === parentId)
    .map((comment) => ({
      ...comment,
      replies: buildCommentTree(comments, comment.id),
    }));
