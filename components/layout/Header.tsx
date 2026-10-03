import Image from 'next/image';

import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import AccountLinks from './AccountLinks';

const logoFont = Montserrat({
  subsets: ['latin'],
  weight: ['500'],
});

const Header = () => {
  return (
    <header className="relative flex justify-between items-center w-full bg-linear-to-r/srgb from-[#440773] to-[#0088a0] px-4 md:px-10 lg:px-25 py-3 sm:py-1.5">
      <Link href={'/'} className="flex gap-2 items-center">
        <Image
          src={'/logo-primary.png'}
          alt={'Forum Logo image'}
          width={54}
          height={54}
          className="w-10 h-10 sm:w-13 sm:h-13"
        />
        <p
          className={`${logoFont.className} hidden sm:block text-xl text-background md:text-2xl lg:text-3xl uppercase`}
        >
          Read IT{' '}
          <span className="capitalize font-extralight font-sans">
            {`- Forum`}
          </span>
        </p>
      </Link>
      <nav className="flex gap-5 justify-center">
        <AccountLinks />
      </nav>
    </header>
  );
};

export default Header;
