import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card, CardActions, Stack } from '@mui/material';
import { PostCompound, ModalUpdatePost, PostItemProvider, Layout, Comments, InputComment } from '../components';
import { useInvalidators } from '../api/hooks';
import { PostService } from '../api/post-service';

export function PostPage() {
  const { id: postId } = useParams();

  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const navigate = useNavigate();

  const { invalidatePost, invalidatePosts } = useInvalidators();

  const { data: post } = useQuery({
    queryKey: ['post', Number(postId)],
    queryFn: () => PostService.fetchPostById(Number(postId)),
    enabled: !!postId && !Number.isNaN(Number(postId)),
  });

  if (!post) return <div>Post not found</div>;

  const deletePost = async (postId: number) => {
    const ok = await PostService.deletePost(postId);
    if (ok) navigate('/posts');
  };

  const handleOpenUpdate = () => setOpenUpdate(true);

  const updatePost = async (id: number, author: string, title: string, content: string) => {
    const ok = await PostService.updatePost(id, author, title, content);
    if (!ok) {
      return;
    }

    invalidatePost(id);
    invalidatePosts();
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  return (
    <Layout>
      <Stack
        direction="column"
        alignItems="start"
        spacing={2}
        padding={4}
      >
        <Button
          component={Link}
          to="/posts"
        >
          Back to Posts
        </Button>
        <Card
          variant="elevation"
          elevation={4}
          sx={{ padding: 2 }}
        >
          <PostItemProvider post={post}>
            <PostCompound.Container>
              <PostCompound.Author />
              <PostCompound.Title />
              <PostCompound.Content />
              <CardActions>
                <PostCompound.UpdateButton handleOpenUpdate={handleOpenUpdate} />
                <PostCompound.DeleteButton deletePost={deletePost} />
              </CardActions>
            </PostCompound.Container>
          </PostItemProvider>
        </Card>
        <ModalUpdatePost
          id={post.id}
          openUpdate={openUpdate}
          onClose={handleCloseUpdate}
          updatePost={updatePost}
        />
      </Stack>
      <InputComment />
      <Comments />
    </Layout>
  );
}
