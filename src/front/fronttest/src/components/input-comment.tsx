import { useState } from 'react';
import { TextField, Button, Box, Alert, Snackbar } from '@mui/material';
import CommentService from '../api/comment-service';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function InputComment() {
  const { id: postId } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Failed to create comment');
  const [comment, setComment] = useState<string>('');

  const queryClient = useQueryClient();
  const { mutate: createComment, isPending } = useMutation({
    mutationFn: () => CommentService.createComment(Number(postId), comment),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', Number(postId)] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to create comment';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleCreateComment = () => {
    if (!comment) return;
    createComment();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, padding: 4, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <TextField
          fullWidth
          label="Comment"
          variant="filled"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCreateComment}
          disabled={isPending}
        >
          Add Comment
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          onClose={handleCloseSnackbar}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
