'use client';

import { DeleteCommentAction } from '@/actions/delete-comment-action';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { toast } from 'sonner';

const DeleteCommentButton = ({ commentId }: { commentId: string }) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: DeleteCommentAction,
    onSettled: () => toast.success('Comment has been deleted'),
  });

  const handleClick = () => {
    mutate(commentId);
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-fit p-4.5 text-lg md:text-lg font-normal border-0 bg-transparent cursor-pointer"
        onClick={() => {
          setShowConfirmAlert(true);
        }}
      >
        <RiDeleteBin5Line className="size-6" />
      </Button>

      <ConfirmAlert
        title="Do you want to delete comment"
        description="This will clear everything you have created on the post."
        btnLable="Delete"
        open={showConfirmAlert}
        onOpenChange={setShowConfirmAlert}
        onConfirm={handleClick}
      />
    </>
  );
};

export default DeleteCommentButton;
