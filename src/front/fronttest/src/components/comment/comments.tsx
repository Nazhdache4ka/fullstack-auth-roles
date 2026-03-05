import { useState } from 'react';
import { Stack, Card, CardContent, Typography, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuthStore } from '../../store/use-auth-store';
import { ModalCommentUpdate } from '../modal/modal-comment-update';
import { UserRole, type IComment } from '../../interface';
import { ErrorAlert } from '../layout/error-alert';
import { useComment } from './hooks/use-comment';

export function Comments() {
  const { user: currentUser } = useAuthStore();

  const [editingComment, setEditingComment] = useState<IComment | null>(null);

  const { commentData, isPending, openSnackbar, errorMessage, deleteComment, handleCloseSnackbar } = useComment();

  const handleOpenUpdate = (com: IComment) => {
    setEditingComment(com);
  };

  const handleCloseUpdate = () => {
    setEditingComment(null);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId);
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      padding={4}
    >
      <h2>Comments</h2>
      {commentData?.map((com) => {
        return (
          <Card
            key={com.id}
            variant="elevation"
            elevation={4}
            sx={{ padding: 2 }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: '1.6rem' }}
                >
                  <strong>{com.username}</strong>
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    padding: '2px 4px',
                    border: '1px solid',
                    borderRadius: '1.5rem',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '.75rem',
                  }}
                >
                  {com.role}
                </Typography>
                {com.is_edited === 1 && (
                  <Typography
                    variant="body1"
                    sx={{ color: 'primary.main', fontSize: '.75rem', opacity: 0.5 }}
                  >
                    Edited
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 0.5, marginLeft: 'auto' }}>
                  {currentUser?.id === com.user_id && (
                    <Button
                      onClick={() => handleOpenUpdate(com)}
                      size="small"
                    >
                      Edit
                    </Button>
                  )}
                  {(currentUser?.role === UserRole.ADMIN || currentUser?.id === com.user_id) && (
                    <Button
                      onClick={() => handleDeleteComment(com.id)}
                      size="small"
                      disabled={isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  )}
                </Box>
              </Box>
              <Typography variant="body1">{com.content}</Typography>
            </CardContent>
          </Card>
        );
      })}
      {editingComment && (
        <ModalCommentUpdate
          key={editingComment.id}
          openUpdate={!!editingComment}
          commentId={editingComment.id}
          initialContent={editingComment.content}
          onClose={handleCloseUpdate}
        />
      )}
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage}
        onClose={handleCloseSnackbar}
      />
    </Stack>
  );
}
