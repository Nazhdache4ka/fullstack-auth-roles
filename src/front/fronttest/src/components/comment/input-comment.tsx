import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { ErrorAlert } from '../layout/error-alert';
import { useInputComment } from './hooks/use-input-comment';

export function InputComment() {
  const [comment, setComment] = useState<string>('');

  const { errorMessage, openSnackbar, isPending, createComment, handleCloseSnackbar } = useInputComment({
    onSuccess: () => setComment(''),
  });

  const handleCreateComment = () => {
    if (!comment) return;
    createComment(comment);
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
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
