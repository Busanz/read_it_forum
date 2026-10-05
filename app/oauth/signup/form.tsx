'use client';

import { SignUpAction } from '@/actions/signup-action';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const SignUpForm = () => {
  return (
    <form className="flex flex-col w-full max-w-lg p-4 sm:p-10 border border-secondary rounded-2xl bg-secondary z-500">
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="fieldgroup-name"
            className="text-pacifica text-base font-semibold"
          >
            User name
          </FieldLabel>
          <Input
            name="fieldgroup-name"
            placeholder="Jordan Lee"
            className="bg-background p-5 h-10 text-base md:text-lg"
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="fieldgroup-email"
            className="text-pacifica text-base font-semibold"
          >
            Email
          </FieldLabel>
          <Input
            name="fieldgroup-email"
            type="email"
            placeholder="name@example.com"
            className="bg-background p-5 h-10 text-base md:text-lg"
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-pacifica text-base font-semibold"
          >
            Password
          </FieldLabel>
          <Input
            name="password"
            type="password"
            required
            className="bg-background p-5 h-10 text-lg md:text-xl"
          />
        </Field>

        <Field orientation="horizontal">
          <Button
            type="reset"
            variant="outline"
            className="rounded-xl text-sm py-5 md:text-lg font-normal border px-8"
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="rounded-xl text-sm py-5 md:text-lg font-normal border px-8 bg-foreground text-background"
            formAction={SignUpAction}
          >
            Sign Up
          </Button>
        </Field>
      </FieldGroup>

      <div className="pt-10">
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
