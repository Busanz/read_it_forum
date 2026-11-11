'use client';

import { DeleteCommentAction } from '@/actions/delete-comment-action';
import ConfirmAlert from '@/components/layout/ConfirmAlert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { toast } from 'sonner';

type DeleteCommentButtonProps = {
  commentId: string;
  setShowButton: (close: boolean) => void;
};

const DeleteCommentButton = ({
  commentId,
  setShowButton,
}: DeleteCommentButtonProps) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: DeleteCommentAction,
    onSuccess: () => {
      toast.success('Comment has been deleted');
      setShowButton(false);
    },
  });

  const handleClick = () => {
    mutate(commentId);
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="rounded-full text-sm py-4.5 md:text-lg font-normal border-none px-7 text-foreground bg-transparent cursor-pointer"
        onClick={() => {
          setShowConfirmAlert(true);
        }}
      >
        <RiDeleteBin5Line className="size-5" />
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
