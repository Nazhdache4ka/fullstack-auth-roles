import { useQueryClient } from '@tanstack/react-query';

export const useInvalidators = () => {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const invalidatePost = (id: number) => {
    queryClient.invalidateQueries({ queryKey: ['post', id] });
  };

  return { invalidatePosts, invalidatePost };
};
