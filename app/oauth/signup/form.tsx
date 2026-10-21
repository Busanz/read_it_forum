'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PiEyeLight, PiEyeSlash } from 'react-icons/pi';

import { useForm } from 'react-hook-form';
import { signUpSchema } from '@/actions/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SignUpAction } from '@/actions/signup-action';
import { useState } from 'react';

const SignUpForm = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset: resetClientErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: SignUpAction,
  });

  const handleReset = () => {
    resetClientErrors();
    resetServerError();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutate(values))}
      className="flex flex-col w-full max-w-lg p-4 sm:p-10 rounded-2xl bg-secondary z-500"
    >
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="fieldgroup-name"
            className="text-pacifica text-base font-semibold"
          >
            User name
          </FieldLabel>
          <Input
            {...register('username')}
            placeholder="Enter your username"
            className="bg-background text-base md:text-lg p-4.5"
          />
        </Field>
        {errors.username?.message && (
          <FieldError>{errors.username.message}</FieldError>
        )}

        <Field>
          <FieldLabel
            htmlFor="fieldgroup-email"
            className="text-pacifica text-base font-semibold"
          >
            Email
          </FieldLabel>
          <Input
            {...register('email')}
            type="email"
            placeholder="name@example.com"
            className="bg-background text-base md:text-lg p-4.5"
          />
        </Field>
        {errors.email?.message && (
          <FieldError>{errors.email.message}</FieldError>
        )}

        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-pacifica text-base font-semibold"
          >
            Password
          </FieldLabel>

          <Input
            {...register('password')}
            type={isShowPassword ? 'text' : 'password'}
            required
            className="bg-background w-full max-w-88 text-lg md:text-xl p-4.5"
          />
        </Field>
        {errors.password?.message && (
          <FieldError>{errors.password.message}</FieldError>
        )}

        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-pacifica text-base font-semibold"
          >
            Confirm Password
          </FieldLabel>
          <div className="flex gap-5">
            <Input
              {...register('confirmPassword')}
              type={isShowPassword ? 'text' : 'password'}
              required
              className="bg-background text-lg md:text-xl p-4.5"
            />
            <Button
              type="button"
              variant="outline"
              className="bg-background text-lg md:text-xl p-4.5"
              onClick={() => setIsShowPassword((prev) => !prev)}
            >
              {isShowPassword ? <PiEyeLight /> : <PiEyeSlash />}
            </Button>
          </div>
        </Field>
        {errors.confirmPassword?.message && (
          <FieldError>{errors.confirmPassword.message}</FieldError>
        )}

        <Field orientation="horizontal">
          <Button
            type="reset"
            variant="outline"
            className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-8"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-8 bg-foreground text-background"
          >
            {isPending ? 'Signing Up' : 'Sign Up'}
          </Button>
        </Field>
        {error && <FieldError>{error.message}</FieldError>}
      </FieldGroup>

      <div className="pt-8">
        <span>Already have a accout?</span>
        <Link href={'/oauth/login'}>
          <span className="text-pacifica text-base font-semibold">
            {' '}
            Log in here
          </span>
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
