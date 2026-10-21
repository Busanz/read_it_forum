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

import { useForm } from 'react-hook-form';
import { logInSchema } from '@/actions/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LogInAction } from '@/actions/login-action';

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    reset: resetClientErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(logInSchema) });

  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: LogInAction,
  });

  const handleReset = () => {
    resetClientErrors();
    resetServerError();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutate(values))}
      className="flex flex-col w-full max-w-lg p-4 sm:p-10 border border-secondary rounded-2xl bg-secondary z-500"
    >
      <FieldGroup>
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
            type="password"
            required
            className="bg-background text-lg md:text-xl p-4.5"
          />
        </Field>
        {errors.password?.message && (
          <FieldError>{errors?.password.message}</FieldError>
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
            {isPending ? 'Loging in ...' : 'Log In'}
          </Button>
        </Field>
        {error && <FieldError>{error.message}</FieldError>}
      </FieldGroup>

      <div className="pt-8">
        Do not have accout?{' '}
        <Link href={'/oauth/signup'}>
          <span className="text-pacifica text-base font-semibold">
            Sign up here
          </span>
        </Link>
      </div>
    </form>
  );
};

export default LogInForm;
