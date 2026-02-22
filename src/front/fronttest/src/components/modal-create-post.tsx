import { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../modal.css';

interface ModalCreatePostProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  createPost: (author: string, title: string, content: string) => void;
}

export function ModalCreatePost({ open, setOpen, createPost }: ModalCreatePostProps) {
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleClose = () => {
    setOpen(false);
    setAuthor('');
    setTitle('');
    setContent('');
  };

  const handleCreatePost = () => {
    createPost(author, title, content);
    handleClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box className="box">
          <TextField
            label="Author"
            variant="filled"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            label="Title"
            variant="filled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Content"
            variant="filled"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleCreatePost}>Create Post</Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}
