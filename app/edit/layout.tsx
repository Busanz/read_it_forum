import Header from '@/components/layout/Header';
import React from 'react';

const EditpostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default EditpostLayout;
