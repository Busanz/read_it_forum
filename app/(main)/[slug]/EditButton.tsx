'use client';

import Link from 'next/link';
type EditButtonProps = {
  currentPostSlug: string;
};

const EditButton = ({ currentPostSlug }: EditButtonProps) => {
  return (
    <Link
      href={`/${currentPostSlug}/edit`}
      className="bg-green-400 px-10 py-2 cursor-pointer"
    >
      EditButton
    </Link>
  );
};

export default EditButton;
