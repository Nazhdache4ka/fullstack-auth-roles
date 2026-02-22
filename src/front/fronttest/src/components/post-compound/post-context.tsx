import { createContext, useContext } from 'react';
import type { IPost } from '../../interface';

const PostItemContext = createContext<IPost | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function usePostItemContext() {
  const context = useContext(PostItemContext);
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentPost() {
  const itemPost = usePostItemContext();
  return itemPost;
}

export function PostItemProvider({ post, children }: { post: IPost; children: React.ReactNode }) {
  return <PostItemContext.Provider value={post}>{children}</PostItemContext.Provider>;
}
