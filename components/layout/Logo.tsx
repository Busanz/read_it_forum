import Image from 'next/image';
import Link from 'next/link';
import { Lato } from 'next/font/google';

const logoFont = Lato({
  subsets: ['latin'],
  weight: ['400'],
});

const Logo = () => {
  return (
    <>
      <Link href={'/'} className="flex gap-2 items-center">
        <Image
          src={'/logo-primary.png'}
          alt={'Forum Logo image'}
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <p
          className={`${logoFont.className} hidden sm:block text-xl text-background md:text-2xl lg:text-[1.7rem] uppercase`}
        >
          Read IT{' '}
          <span className="capitalize font-extralight font-sans">
            {`- Forum`}
          </span>
        </p>
      </Link>
    </>
  );
};

export default Logo;
