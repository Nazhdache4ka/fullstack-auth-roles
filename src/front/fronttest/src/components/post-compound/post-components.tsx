import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { useCurrentPost } from './post-context';
import { PostItemProvider } from './post-context';
import type { IPost } from '../../interface';

interface PostListProps extends PropsWithChildren {
  posts: IPost[];
}

export function PostList({ posts, children }: PostListProps) {
  if (!posts?.length) return <div>No posts found</div>;

  return (
    <>
      {posts.map((post) => (
        <PostItemProvider
          key={post.id}
          post={post}
        >
          {children}
        </PostItemProvider>
      ))}
    </>
  );
}

export function PostContainer({ children }: PropsWithChildren) {
  const post = useCurrentPost();

  if (!post) return <div>Post not found</div>;

  return children;
}

export function PostAuthor() {
  const post = useCurrentPost();

  if (!post) return <div>Post not found</div>;

  return <h1>{post.author}</h1>;
}

export function PostTitle() {
  const post = useCurrentPost();

  if (!post) return <div>Post not found</div>;

  return <h3>{post.title}</h3>;
}

export function PostContent() {
  const post = useCurrentPost();

  if (!post) return <div>Post not found</div>;

  return <p>{post.content}</p>;
}

export function PostUpdateButton({ handleOpenUpdate }: { handleOpenUpdate: (id: number) => void }) {
  const post = useCurrentPost();

  if (!post) return null;

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => handleOpenUpdate(post.id)}
    >
      Update Post
    </Button>
  );
}

export function PostDeleteButton({ deletePost }: { deletePost: (id: number) => void }) {
  const post = useCurrentPost();

  if (!post) return null;

  return (
    <Button
      color="error"
      variant="contained"
      onClick={() => deletePost(post.id)}
    >
      Delete Post
    </Button>
  );
}

export function PostGetButton({ handleGetPost }: { handleGetPost: (id: number) => void }) {
  const post = useCurrentPost();

  if (!post) return null;

  return (
    <Button
      variant="outlined"
      component={Link}
      to={`/posts/${post.id}`}
      onClick={() => handleGetPost(post.id)}
    >
      Get Post
    </Button>
  );
}
