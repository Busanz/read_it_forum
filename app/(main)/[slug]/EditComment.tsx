'use client';

import { useState } from 'react';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { FiEdit } from 'react-icons/fi';

const EditComment = () => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const handleClick = () => {};
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-5 bg-foreground text-background"
        onClick={() => setShowConfirmAlert(true)}
      >
        <FiEdit />
      </Button>
      <ConfirmAlert
        title="Do you want to delete post"
        description="This will clear everything you have created on the post."
        btnLable="Delete"
        open={showConfirmAlert}
        onOpenChange={setShowConfirmAlert}
        onConfirm={handleClick}
      />
    </>
  );
};

export default EditComment;
