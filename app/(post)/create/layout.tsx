import Header from '@/components/layout/Header';
import React from 'react';

const CreatePostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default CreatePostLayout;
