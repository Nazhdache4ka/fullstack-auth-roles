import { useQueryClient } from '@tanstack/react-query';

export const useInvalidators = () => {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const invalidatePost = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ['post', id] });
  };

  const invalidateComments = (postId: number) => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
  };

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  return { invalidatePosts, invalidatePost, invalidateComments, invalidateUsers };
};
