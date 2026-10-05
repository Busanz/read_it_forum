import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Hero />
      {children}
    </>
  );
};

export default MainLayout;
