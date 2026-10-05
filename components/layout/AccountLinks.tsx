import Link from 'next/link';
import { createClient } from '@/lib/supabase/serverClient';
import { LogOutAction } from '@/actions/logout-action';

import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from '@/components/ui/avatar';

import { RxAvatar } from 'react-icons/rx';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { MdOutlinePostAdd } from 'react-icons/md';

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user: signInUser },
  } = await supabase.auth.getUser();

  return (
    <>
      {signInUser ? (
        <>
          <Link href={'/create'}>
            <Button
              variant={'outline'}
              className="rounded-full text-sm py-4 md:text-lg border border-secondary text-secondary bg-transparent cursor-pointer font-normal"
            >
              <MdOutlinePostAdd />
              Add Post
            </Button>
          </Link>

          <Button
            variant={'outline'}
            className="rounded-full text-sm py-4 md:text-lg border border-secondary text-secondary bg-transparent cursor-pointer font-normal"
            onClick={LogOutAction}
          >
            <IoIosLogOut />
            Log Out
          </Button>
        </>
      ) : (
        <>
          <Link href={'/create'}>
            <Button
              variant={'outline'}
              className="rounded-full text-sm md:text-lg px-4 border border-secondary text-secondary bg-transparent cursor-pointer font-normal "
            >
              <MdOutlinePostAdd />
            </Button>
          </Link>
          <Link href={'/oauth/login'}>
            <Button className="rounded-full text-sm md:text-lg py-4 border border-secondary text-secondary bg-transparent font-normal">
              <RxAvatar />
              Log In
            </Button>
          </Link>

          <Link href={'/oauth/signup'}>
            <Button
              variant={'default'}
              className="rounded-full text-sm py-4 md:text-lg border border-secondary text-secondary bg-transparent font-normal"
            >
              <AiOutlineUserAdd />
              Sign Up
            </Button>
          </Link>
        </>
      )}
      <div>
        <Avatar>
          <AvatarImage src="avatar.png" alt="@shadcn" />
          <AvatarFallback>RIT</AvatarFallback>
          <AvatarBadge
            className={`${signInUser ? 'bg-green-600' : 'bg-gray-400'} dark:bg-green-800`}
          />
        </Avatar>
      </div>
    </>
  );
};

export default AccountLinks;
