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
import { useRef, useState } from 'react';
import { EditPostAction } from '@/actions/edit-action';
import { toast } from 'sonner';
import { RxCross2 } from 'react-icons/rx';
import {
  Attachment,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import ImagePreviews from '@/components/layout/ImagePreviews';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POST_CATEGORIES } from '@/app/(post)/create/post-categories';

const CONTENT_MAX = 3000;
const IMAGE_MAX_NUM = 3;

type EditPostFormProps = {
  initialValues: Pick<
    Tables<'td_post'>,
    'post_title' | 'post_content' | 'post_category'
  > & {
    post_images: string[];
  };
  postId: string;
};

const EditPostForm = ({ initialValues, postId }: EditPostFormProps) => {
  const router = useRouter();
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const [isAddingImages, setIsAddingImages] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialValues.post_images,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    trigger,
    reset: resetClientErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      post_title: initialValues.post_title,
      post_category: initialValues.post_category!,
      post_content: initialValues.post_content || undefined,
      post_img: [] as File[],
    },
  });

  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: EditPostAction,
    onSuccess: ({ slug }) => {
      toast.success('Post has been updated');
      router.push(`/${slug}`);
    },
  });

  const handleReset = () => {
    resetClientErrors();
    resetServerError();
    setExistingImages(initialValues.post_images);
    setIsAddingImages(false);
    setShowConfirmAlert(false);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        mutate({
          postId,
          postData: {
            post_title: values.post_title,
            post_category: values.post_category,
            post_content: values.post_content,
            post_img: values.post_img ?? [],
            keep_image_urls: existingImages,
          },
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
          name="post_category"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.post_category}>
              <FieldLabel
                htmlFor="post_category"
                className="text-pacifica text-base font-semibold"
              >
                Post Category
              </FieldLabel>

              <Select
                items={POST_CATEGORIES}
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
              >
                <SelectTrigger id="post_category" className="w-full max-w-64">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {POST_CATEGORIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.post_category && (
                <FieldError errors={[errors.post_category]} />
              )}
            </Field>
          )}
        />
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

        <Field data-invalid={!!errors.post_img}>
          <FieldLabel
            htmlFor="post_img"
            className="text-pacifica text-base font-semibold"
          >
            Upload up to {IMAGE_MAX_NUM} images
            <span className="text-sm font-light">{`( optional )`}</span>
          </FieldLabel>

          <Controller
            name="post_img"
            control={control}
            render={({ field }) => {
              const files = (field.value as File[] | undefined) ?? [];
              const total = existingImages.length + files.length;
              const limitReached = total >= IMAGE_MAX_NUM;
              const isBusy = isAddingImages || isPending;

              return (
                <>
                  <Input
                    ref={fileInputRef}
                    id="post_img"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={async (e) => {
                      const picked = Array.from(e.target.files ?? []);
                      e.target.value = '';
                      if (picked.length === 0) return;

                      setIsAddingImages(true);
                      try {
                        field.onChange(
                          [...files, ...picked].slice(
                            0,
                            IMAGE_MAX_NUM - existingImages.length,
                          ),
                        );
                        void trigger('post_img');
                      } finally {
                        setIsAddingImages(false);
                      }
                    }}
                  />
                  <div className="flex gap-3">
                    {existingImages.length > 0 && (
                      <AttachmentGroup>
                        {existingImages.map((url, index) => (
                          <Attachment
                            key={url}
                            orientation="vertical"
                            className="relative"
                          >
                            <AttachmentMedia variant="image">
                              <Image
                                src={url}
                                alt={`Current image ${index + 1}`}
                                fill
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, 512px"
                              />
                            </AttachmentMedia>
                            <AttachmentContent>
                              <AttachmentTitle>
                                Uploaded 0{index + 1}
                              </AttachmentTitle>
                            </AttachmentContent>
                            <button
                              type="button"
                              onClick={() =>
                                setExistingImages((prev) =>
                                  prev.filter((u) => u !== url),
                                )
                              }
                              aria-label={`Remove current image ${index + 1}`}
                              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                            >
                              <RxCross2 />
                            </button>
                          </Attachment>
                        ))}
                      </AttachmentGroup>
                    )}
                    <ImagePreviews
                      files={files}
                      onRemove={(index) => {
                        field.onChange(files.filter((_, i) => i !== index));
                        void trigger('post_img');
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={limitReached || isBusy}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isBusy ? 'Uploading..' : 'Choose images'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {total} / {IMAGE_MAX_NUM} selected
                    </span>
                  </div>
                </>
              );
            }}
          />

          {errors.post_img && <FieldError errors={[errors.post_img]} />}
        </Field>

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

        {error && !error.message.includes('NEXT_REDIRECT') && (
          <FieldError>{error.message}</FieldError>
        )}
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
