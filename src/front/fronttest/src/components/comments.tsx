import { useQuery } from '@tanstack/react-query';
import { Stack, Card, CardContent, Typography } from '@mui/material';
import CommentService from '../api/comment-service';
import { useParams } from 'react-router-dom';

export function Comments() {
  const { id: postId } = useParams();

  const { data: comments } = useQuery({
    queryKey: ['comments', Number(postId)],
    queryFn: () => CommentService.fetchCommentsByPostId(Number(postId)),
    enabled: !!postId && !Number.isNaN(Number(postId)),
  });

  return (
    <Stack
      direction="column"
      spacing={2}
      padding={4}
    >
      <h2>Comments</h2>
      {comments?.map((com) => {
        return (
          <Card
            key={com.id}
            variant="elevation"
            elevation={4}
            sx={{ padding: 2 }}
          >
            <CardContent>
              <Typography variant="body1">
                <strong>{com.username}</strong>
              </Typography>
              <Typography variant="body1">{com.content}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
