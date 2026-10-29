'use client';

import Link from 'next/link';
import { BiEdit } from 'react-icons/bi';
type EditButtonProps = {
  currentPostSlug: string;
};

const EditButton = ({ currentPostSlug }: EditButtonProps) => {
  return (
    <Link
      href={`edit/${currentPostSlug}/`}
      className="rounded-full text-sm md:text-lg font-normal border-0 px-8 py-2 bg-background text-foreground"
    >
      <BiEdit className="size-5" />
    </Link>
  );
};

export default EditButton;
