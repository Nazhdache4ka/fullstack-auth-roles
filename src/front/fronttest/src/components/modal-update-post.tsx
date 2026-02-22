import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import '../modal.css';
import PostService from '../api/post-service';
import { useQuery } from '@tanstack/react-query';

interface ModalUpdatePostProps {
  id: number;
  openUpdate: boolean;
  onClose: () => void;
  updatePost: (id: number, author: string, title: string, content: string) => void;
}

export function ModalUpdatePost({ id, openUpdate, onClose, updatePost }: ModalUpdatePostProps) {
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { data: postData } = useQuery({
    queryKey: ['post', id],
    queryFn: () => PostService.fetchPostById(id),
    enabled: !!id && !Number.isNaN(id) && openUpdate,
  });

  useEffect(() => {
    if (!postData) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthor(postData.author);
    setTitle(postData.title);
    setContent(postData.content);
  }, [postData]);

  const handleCloseUpdate = () => {
    onClose();
  };

  const handleUpdatePost = async () => {
    updatePost(id, author, title, content);
    handleCloseUpdate();
  };

  return (
    <>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
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
          <Button onClick={handleUpdatePost}>Update Post</Button>
          <Button onClick={handleCloseUpdate}>Close</Button>
        </Box>
      </Modal>
    </>
  );
}
