import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RxAvatar } from 'react-icons/rx';
import { AiOutlineUserAdd } from 'react-icons/ai';

const AccountLinks = () => {
  return (
    <>
      <Link href={'/login'}>
        <Button
          variant={'outline'}
          className="rounded-full text-sm py-4 md:text-lg border border-secondary text-secondary bg-transparent"
        >
          <RxAvatar />
          Log In
        </Button>
      </Link>

      <Link href={'/signup'}>
        <Button
          variant={'outline'}
          className="rounded-full text-sm py-4 md:text-lg border border-secondary text-secondary bg-transparent"
        >
          <AiOutlineUserAdd />
          Sign Up
        </Button>
      </Link>
    </>
  );
};

export default AccountLinks;
