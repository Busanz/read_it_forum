import Link from 'next/link';
import { createClient } from '@/lib/supabase/serverClient';
import { LogOutAction } from '@/actions/logout-action';

import { Button } from '@/components/ui/button';

import { RxAvatar } from 'react-icons/rx';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { MdOutlinePostAdd } from 'react-icons/md';
import { getSignedUserName } from '@/lib/supabase/queries';
import UserPopover from './UserPopover';

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user: signInUser },
  } = await supabase.auth.getUser();

  let userName: string | null = null;

  if (signInUser) {
    const { data: signInUsername } = await getSignedUserName(signInUser.id);
    userName = signInUsername?.user_name ?? null;
  }

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
      {signInUser && (
        <div className="flex gap-2">
          <UserPopover
            userName={userName!}
            signInUser={signInUser ? true : false}
            signInUserEmail={signInUser!.email!}
          />
        </div>
      )}
    </>
  );
};

export default AccountLinks;
