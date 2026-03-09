import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CommentService } from '../../../api/comment-service';
import { useInvalidators } from '../../../api/hooks';
import { useParams } from 'react-router-dom';

export function useComment() {
  const { id: postId } = useParams();

  const { invalidateComments } = useInvalidators();

  const [errorMessage, setErrorMessage] = useState<string>('Failed to delete comment');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const { data: commentData, isPending } = useQuery({
    queryKey: ['comments', Number(postId)],
    queryFn: () => CommentService.fetchCommentsByPostId(Number(postId)),
    enabled: !!postId && !Number.isNaN(Number(postId)),
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: number) => CommentService.deleteComment(Number(postId), commentId),
    onSuccess: () => {
      invalidateComments(Number(postId));
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to delete comment';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return { commentData, isPending, openSnackbar, errorMessage, deleteComment, handleCloseSnackbar };
}
