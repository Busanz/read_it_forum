'use client';

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

import { Controller, useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema } from '@/actions/schema';
import { useMutation } from '@tanstack/react-query';
import { CreatePostAction } from '@/actions/create-action';
import { toast } from 'sonner';
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
import { POST_CATEGORIES } from './post-categories';

const CONTENT_MAX = 3000;
const IMAGE_MAX_NUM = 3;

const CreatePostForm = () => {
  const router = useRouter();
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddingImages, setIsAddingImages] = useState(false);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    reset: resetClientErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      post_title: '',
      post_content: '',
      post_category: 'general',
    },
  });

  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: CreatePostAction,
    onSuccess: ({ slug }) => {
      toast.success('Post has been created');
      router.push(`/${slug}`);
    },
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
        mutate({
          post_title: values.post_title,
          post_category: values.post_category,
          post_content: values.post_content,
          post_img: values.post_img ? Array.from(values.post_img) : undefined,
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
              const limitReached = files.length >= IMAGE_MAX_NUM;
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
                          [...files, ...picked].slice(0, IMAGE_MAX_NUM),
                        );
                        void trigger('post_img');
                      } finally {
                        setIsAddingImages(false);
                      }
                    }}
                  />

                  <ImagePreviews
                    files={files}
                    onRemove={(index) => {
                      field.onChange(files.filter((_, i) => i !== index));
                      void trigger('post_img');
                    }}
                  />

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
                      {files.length} / {IMAGE_MAX_NUM} selected
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
            {isPending ? 'Creating post...' : 'Add post'}
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

export default CreatePostForm;
