import { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../../modal.css';
import { ErrorAlert } from '../layout/error-alert';
import { useCommentModal } from './hooks/use-comment-modal';

interface ModalCommentUpdateProps {
  openUpdate: boolean;
  commentId: number;
  initialContent: string;
  onClose: () => void;
}

export function ModalCommentUpdate({ openUpdate, commentId, initialContent, onClose }: ModalCommentUpdateProps) {
  const [content, setContent] = useState<string>(initialContent);

  const { errorMessage, openSnackbar, isPending, updateComment, handleCloseSnackbar } = useCommentModal({
    onSuccess: onClose,
  });

  const handleUpdateComment = () => {
    if (!content) return;
    updateComment({ content, commentId });
    onClose();
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
