import Logo from '@/components/layout/Logo';
import React from 'react';

const OauthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="flex sticky top-0 left-0 justify-between items-center w-full bg-linear-to-r/srgb from-[#440773] to-[#0088a0] px-4  py-3 sm:py-1.5 z-500">
        <Logo />
      </header>
      {children}
    </>
  );
};

export default OauthLayout;
