import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CommentService } from '../../../api/comment-service';
import { useParams } from 'react-router-dom';
import { useInvalidators } from '../../../api/hooks';
import type { AxiosError } from 'axios';

interface UseCommentModalProps {
  onSuccess: () => void;
}

export function useCommentModal({ onSuccess }: UseCommentModalProps) {
  const { id: postId } = useParams();

  const { invalidateComments } = useInvalidators();

  const [errorMessage, setErrorMessage] = useState<string>('Failed to update comment');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const { mutate: updateComment, isPending } = useMutation({
    mutationFn: ({ content, commentId }: { content: string; commentId: number }) =>
      CommentService.editComment(Number(postId), content, commentId),
    onSuccess: () => {
      invalidateComments(Number(postId));
      onSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to update comment';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return { errorMessage, openSnackbar, isPending, updateComment, handleCloseSnackbar };
}
