'use client';

import { DeletePostAction } from '@/actions/delete-action';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { toast } from 'sonner';

const DeleteButton = ({ id }: { id: string }) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);
  const { mutate } = useMutation({
    mutationFn: DeletePostAction,
    onSettled: () => toast.success('Post has been deleted'),
  });

  const handleClick = () => {
    mutate(id);
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full text-sm py-4.5 md:text-lg font-normal border px-5 bg-foreground text-background"
        onClick={() => setShowConfirmAlert(true)}
      >
        <RiDeleteBin5Line />
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

export default DeleteButton;
