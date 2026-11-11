'use client';

import { useState } from 'react';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { FiEdit } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import { EditCommentAction } from '@/actions/edit-comment-action';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/actions/schema';
import { RiResetLeftLine } from 'react-icons/ri';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

const CONTENT_MAX = 3000;

type EditCommentProps = {
  commentId: string;
  commentContent: string;
  setShowButton: (close: boolean) => void;
};

const EditComment = ({
  commentId,
  commentContent,
  setShowButton,
}: EditCommentProps) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment_content: commentContent },
  });

  const {
    mutate,
    isPending,
    error,
    reset: serverErrors,
  } = useMutation({
    mutationFn: EditCommentAction,
    onSuccess: () => {
      toast.success('Comment has been changed');
      setShowEditDialog(false);
      setShowButton(false);
    },
  });

  const openEditDialog = () => {
    reset({ comment_content: commentContent });
    serverErrors();
    setShowConfirmAlert(false);
    setShowEditDialog(true);
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full text-sm py-4.5 md:text-lg font-normal border-none px-7 text-foreground bg-transparent cursor-pointer"
        onClick={() => setShowConfirmAlert(true)}
      >
        <FiEdit className="size-4.5" />
      </Button>
      <ConfirmAlert
        title="Do you want to edit comment"
        description="You can change your owne comment"
        btnLable="Edit comment"
        open={showConfirmAlert}
        onOpenChange={setShowConfirmAlert}
        onConfirm={openEditDialog}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-full sm:max-w-4xl">
          <form
            noValidate
            onSubmit={handleSubmit((values) =>
              mutate({
                comment_id: commentId,
                comment_content: values.comment_content,
              }),
            )}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Edit comment</DialogTitle>
              <DialogDescription>
                Make changes to your comment here, then save.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Controller
                name="comment_content"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.comment_content}>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="comment_content"
                        placeholder="Write your comment here..."
                        rows={10}
                        maxLength={CONTENT_MAX}
                        className="min-h-24 resize-none bg-background text-base md:text-lg rounded-t-xl"
                      />
                      <InputGroupAddon
                        align="block-end"
                        className="flex w-full justify-between bg-gray-100/80 border-t"
                      >
                        <InputGroupText className="tabular-nums w-full">
                          {(field.value ?? '').length}/{CONTENT_MAX} characters
                        </InputGroupText>
                        <Field
                          orientation="horizontal"
                          className="flex justify-end"
                        >
                          {field.value !== commentContent && (
                            <Button
                              type="button"
                              variant="outline"
                              aria-label="Restore the original comment"
                              className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-8 bg-header/60"
                              onClick={() => field.onChange(commentContent)}
                            >
                              <RiResetLeftLine />
                            </Button>
                          )}

                          <Button
                            type="submit"
                            variant="outline"
                            aria-label="Save comment"
                            disabled={isPending}
                            className="rounded-full text-sm py-4 md:text-base font-normal border px-4 bg-header/60 text-background"
                          >
                            {isPending ? 'Saving...' : 'Save comment'}
                          </Button>
                        </Field>
                      </InputGroupAddon>
                    </InputGroup>

                    {errors.comment_content && (
                      <FieldError errors={[errors.comment_content]} />
                    )}
                  </Field>
                )}
              />

              {error && <FieldError>{error.message}</FieldError>}
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="max-w-20 rounded-full px-5"
                  >
                    Cancel
                  </Button>
                }
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditComment;
