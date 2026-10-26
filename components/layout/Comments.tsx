import { PostCommentsType } from '@/lib/supabase/queries';

const Comments = ({ comments }: { comments: PostCommentsType }) => {
  return (
    <div className="bg-green-200">
      {comments && (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col bg-indigo-200 text-black mt-2"
            >
              <p>{comment.comment_content}</p>
              <p>{comment.comment_user_id.user_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
