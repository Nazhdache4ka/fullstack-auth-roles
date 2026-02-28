import { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { CommentService } from '../../api/comment-service';
import { useParams } from 'react-router-dom';
import '../../modal.css';
import { ErrorAlert } from '../layout/error-alert';
import { useInvalidators } from '../../api/hooks';

interface ModalCommentUpdateProps {
  openUpdate: boolean;
  commentId: number;
  initialContent: string;
  onClose: () => void;
}

export function ModalCommentUpdate({ openUpdate, commentId, initialContent, onClose }: ModalCommentUpdateProps) {
  const { id: postId } = useParams();

  const [content, setContent] = useState<string>(initialContent);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Failed to update comment');

  const { invalidateComments } = useInvalidators();

  const { mutate: updateComment, isPending } = useMutation({
    mutationFn: () => CommentService.editComment(Number(postId), content, commentId),
    onSuccess: () => {
      setContent('');
      invalidateComments(Number(postId));
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to update comment';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleUpdateComment = () => {
    if (!content) return;
    updateComment();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Modal
        open={openUpdate}
        onClose={onClose}
      >
        <Box
          className="box"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Comment"
            variant="filled"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            onClick={handleUpdateComment}
            disabled={isPending}
          >
            Update Comment
          </Button>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Modal>
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
