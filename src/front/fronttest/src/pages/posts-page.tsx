import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardActions, Stack } from '@mui/material';
import { ModalCreatePost, ModalUpdatePost, PostCompound, Layout } from '../components';
import PostService from '../api/post-service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInvalidators } from '../api/hooks';

const LIMIT = 10;

export function PostsPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  const navigate = useNavigate();

  const { invalidatePosts } = useInvalidators();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => PostService.fetchAllPosts(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, portionsPages) => {
      if (!lastPage) return undefined;
      if (lastPage.length < LIMIT) return undefined;

      return portionsPages.length * LIMIT;
    },
  });

  const allPosts = useMemo(() => {
    if (!posts) return [];

    return posts.pages.flatMap((page) => page ?? []);
  }, [posts]);

  const handleOpen = () => {
    setOpen(true);
  };

  async function handleOpenUpdate(id: number) {
    try {
      const post = await PostService.fetchPostById(id);
      if (post) {
        setId(post.id);
        setOpenUpdate(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleCloseUpdate = async () => {
    setOpenUpdate(false);
    setId(0);
  };

  const createPost = async (author: string, title: string, content: string) => {
    await PostService.createPost(author, title, content);
    invalidatePosts();
  };

  const updatePost = async (id: number, author: string, title: string, content: string) => {
    await PostService.updatePost(id, author, title, content);
    invalidatePosts();
  };

  const deletePost = async (id: number) => {
    await PostService.deletePost(id);
    invalidatePosts();
  };

  return (
    <Layout>
      <Stack
        direction="column"
        spacing={2}
        padding={4}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Create Post
        </Button>
        <ModalCreatePost
          open={open}
          setOpen={setOpen}
          createPost={createPost}
        />
        <ModalUpdatePost
          id={id}
          openUpdate={openUpdate}
          onClose={handleCloseUpdate}
          updatePost={updatePost}
        />
        <Stack
          direction="column"
          spacing={2}
        >
          <PostCompound.List posts={allPosts}>
            <Card
              variant="elevation"
              elevation={4}
              sx={{ padding: 2 }}
            >
              <PostCompound.Container>
                <PostCompound.Author />
                <PostCompound.Title />
                <PostCompound.Content />
                <CardActions>
                  <PostCompound.GetButton handleGetPost={(id) => navigate(`/posts/${id}`)} />
                  <PostCompound.UpdateButton handleOpenUpdate={handleOpenUpdate} />
                  <PostCompound.DeleteButton deletePost={deletePost} />
                </CardActions>
              </PostCompound.Container>
            </Card>
          </PostCompound.List>
        </Stack>
        {hasNextPage && <Button onClick={() => fetchNextPage()}>Load More</Button>}
      </Stack>
    </Layout>
  );
}
