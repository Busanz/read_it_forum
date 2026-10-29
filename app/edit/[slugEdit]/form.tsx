'use client';

import Image from 'next/image';
import { createPostSchema } from '@/actions/schema';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { type Tables } from '@/lib/supabase/database.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { EditPostAction } from '@/actions/edit-action';
import z from 'zod';

const CONTENT_MAX = 3000;

const EditPostForm = ({
  initialValues,
  postId,
}: {
  initialValues: Pick<
    Tables<'td_post'>,
    'post_title' | 'post_content' | 'post_img'
  >;
  postId: string;
}) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const postImageSchema = createPostSchema.omit({ post_img: true }).extend({
    post_img: z
      .unknown()
      .transform((values) => {
        return values as FileList;
      })
      .optional(),
  });

  const {
    register,
    control,
    reset: resetClientErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postImageSchema),
    defaultValues: {
      post_title: initialValues.post_title,
      post_content: initialValues.post_content || undefined,
      post_img: initialValues.post_img || undefined,
    },
  });

  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: EditPostAction,
  });

  const handleReset = () => {
    resetClientErrors();
    resetServerError();
    setShowConfirmAlert(false);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        let imageForm = undefined;

        if (values.post_img && typeof values.post_img !== 'string') {
          imageForm = new FormData();
          imageForm.append('post_img', values.post_img[0]);
        }

        mutate({
          postData: {
            post_title: values.post_title,
            post_content: values.post_content,
            post_img: imageForm,
          },
          postId,
        });
      })}
      className="flex flex-col w-full max-w-3xl p-4 sm:p-10 rounded-2xl bg-secondary z-500"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.post_title}>
          <FieldLabel
            htmlFor="post_title"
            className="text-pacifica text-base font-semibold"
          >
            Post title
          </FieldLabel>
          <Input
            id="post_title"
            {...register('post_title')}
            placeholder="Write your post title..."
            className="bg-background p-5 h-10 text-base md:text-lg"
          />
          {errors.post_title && <FieldError errors={[errors.post_title]} />}
        </Field>

        <Controller
          name="post_content"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.post_content}>
              <FieldLabel
                htmlFor="post_content"
                className="text-pacifica text-base font-semibold"
              >
                Post content
                <span className="text-sm font-light">{`( optional )`}</span>
              </FieldLabel>

              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="post_content"
                  placeholder="Write your post content..."
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

              {errors.post_content && (
                <FieldError errors={[errors.post_content]} />
              )}
            </Field>
          )}
        />
        {initialValues.post_img && (
          <Field data-invalid={!!errors.post_title}>
            <FieldLabel
              htmlFor="post_img"
              className="text-pacifica text-base font-semibold pb-2"
            >
              Upload Image(s)
              <span className="text-sm font-light">{`( optional )`}</span>
            </FieldLabel>
            <Image
              src={initialValues.post_img}
              alt={initialValues.post_title}
              width={500}
              height={400}
            />
            <Input
              id="post_img"
              type="file"
              {...register('post_img')}
              className="bg-background h-10 text-base md:text-lg mt-3"
            />
            {errors.post_img && <FieldError errors={[errors.post_img]} />}
          </Field>
        )}

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
            {isPending ? 'Updating post...' : 'Update post'}
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

export default EditPostForm;
