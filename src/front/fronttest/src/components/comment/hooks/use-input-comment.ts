import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CommentService } from '../../../api/comment-service';
import { useInvalidators } from '../../../api/hooks';
import { useParams } from 'react-router-dom';

interface UseInputCommentOptions {
  onSuccess?: () => void;
}

export function useInputComment({ onSuccess }: UseInputCommentOptions) {
  const { id: postId } = useParams();

  const { invalidateComments } = useInvalidators();

  const [errorMessage, setErrorMessage] = useState<string>('Failed to create comment');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: (comment: string) => CommentService.createComment(Number(postId), comment),
    onSuccess: () => {
      invalidateComments(Number(postId));
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to create comment';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return { errorMessage, openSnackbar, isPending, createComment, handleCloseSnackbar };
}
