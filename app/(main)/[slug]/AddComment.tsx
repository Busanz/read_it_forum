'use client';

import { useState } from 'react';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/actions/schema';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { AddCommentAction } from '@/actions/add-comment-action';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { toast } from 'sonner';

const CONTENT_MAX = 3000;

type AddCommentProps = {
  postId: string;
};

const AddComment = ({ postId }: AddCommentProps) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);

  const {
    register,
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
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: AddCommentAction,
    onSuccess: () => resetForm(),
    onSettled: () => toast.success('Comment has been added'),
  });

  const handleReset = () => {
    resetForm();
    resetServerError();
    setShowConfirmAlert(false);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        mutate({
          commentData: { comment_content: values.comment_content },
          postId,
        }),
      )}
      className="flex my-5 text-black"
    >
      <FieldGroup>
        <Controller
          name="comment_content"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.comment_content}>
              <FieldLabel
                htmlFor="comment_content"
                className="text-pacifica text-base font-semibold"
              >
                Add new comment
              </FieldLabel>

              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="comment_content"
                  placeholder="Write your comment here..."
                  rows={6}
                  maxLength={CONTENT_MAX}
                  className="min-h-24 resize-none bg-background text-base md:text-lg rounded-t-xl"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {(field.value ?? '').length}/{CONTENT_MAX} characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              {errors.comment_content && (
                <FieldError errors={[errors.comment_content]} />
              )}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-8"
            onClick={() => setShowConfirmAlert(true)}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={isPending}
            className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-8 bg-foreground text-background"
          >
            {isPending ? 'Adding comment...' : 'Add comment'}
          </Button>
        </Field>

        {error && <FieldError>{error.message}</FieldError>}
      </FieldGroup>

      <ConfirmAlert
        title="Reset the form?"
        description="This will clear everything you have entered."
        btnLable="Reset"
        open={showConfirmAlert}
        onOpenChange={setShowConfirmAlert}
        onConfirm={handleReset}
      />
    </form>
  );
};

export default AddComment;
