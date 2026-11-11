'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FiCornerUpLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { commentSchema } from '@/actions/schema';
import { AddReplyAction } from '@/actions/add-reply-action';

const CONTENT_MAX = 1000;

type ReplyCommentProps = {
  commentId: string;
  postId: string;
  setShowButton: (close: boolean) => void;
};

const ReplyComment = ({
  commentId,
  postId,
  setShowButton,
}: ReplyCommentProps) => {
  const [isReplying, setIsReplying] = useState(false);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment_content: '' },
  });

  const {
    mutate,
    isPending,
    error,
    reset: resetServerError,
  } = useMutation({
    mutationFn: AddReplyAction,
    onSuccess: () => {
      toast.success('Reply has been added');
      closeReply();
      setShowButton(false);
    },
  });

  const closeReply = () => {
    resetForm();
    resetServerError();
    setIsReplying(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-label={isReplying ? 'Cancel reply' : 'Reply to comment'}
        className="rounded-full text-sm py-4.5 md:text-lg font-normal border-none px-7 text-foreground bg-transparent cursor-pointer"
        onClick={() => (isReplying ? closeReply() : setIsReplying(true))}
      >
        <FiCornerUpLeft className="size-4.5" />
      </Button>

      {isReplying && (
        <form
          noValidate
          onSubmit={handleSubmit((values) =>
            mutate({
              postId,
              parentId: commentId,
              commentData: { comment_content: values.comment_content },
            }),
          )}
          className="flex w-full flex-col gap-2"
        >
          <Controller
            name="comment_content"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.comment_content}>
                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                  <InputGroupTextarea
                    {...field}
                    autoFocus
                    placeholder="Write your reply here..."
                    rows={3}
                    maxLength={CONTENT_MAX}
                    className="w-full min-h-24 resize-none bg-background text-base lg:text-lg rounded-lg"
                  />
                </InputGroup>

                <InputGroupText className="tabular-nums w-full">
                  {(field.value ?? '').length}/{CONTENT_MAX} characters
                </InputGroupText>

                {errors.comment_content && (
                  <FieldError errors={[errors.comment_content]} />
                )}
              </Field>
            )}
          />
          {error && !error.message.includes('NEXT_REDIRECT') && (
            <FieldError>{error.message}</FieldError>
          )}

          <div className="flex justify-end gap-2 mb-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="rounded-full px-6"
              onClick={closeReply}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full px-6 text-background bg-header/60"
            >
              {isPending ? 'Replying...' : 'Reply'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default ReplyComment;
