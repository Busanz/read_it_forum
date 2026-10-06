'use client';

import { LogInAction } from '@/actions/login-action';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { logInSchema } from '@/actions/schema';
import { useMutation } from '@tanstack/react-query';

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    reset: resetClientErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(logInSchema) });

  console.log('Frontend errors:', errors);
  const {
    mutate,
    error,
    isPending,
    reset: resetServerError,
  } = useMutation({
    mutationFn: LogInAction,
  });
  console.log('Server error:', error);
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
            className="bg-background p-5 h-10 text-base md:text-lg"
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
            className="bg-background p-5 h-10 text-lg md:text-xl"
          />
        </Field>
        {errors.password?.message && (
          <FieldError>{errors?.password.message}</FieldError>
        )}

        <Field orientation="horizontal">
          <Button
            type="reset"
            variant="outline"
            className="rounded-xl text-sm py-5 md:text-lg font-normal border px-8"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="rounded-xl text-sm py-5 md:text-lg font-normal border px-8 bg-foreground text-background"
          >
            {isPending ? 'Loging in ...' : 'Log In'}
          </Button>
        </Field>
        {error && <FieldError>{error.message}</FieldError>}
      </FieldGroup>

      <div className="pt-10">
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
