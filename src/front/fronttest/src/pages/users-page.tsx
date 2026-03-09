import { useMemo } from 'react';
import { Layout, UserCompound } from '../components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UserService } from '../api/user-service';
import { Stack, Card, Button } from '@mui/material';

const LIMIT = 10;

export function UsersPage() {
  const {
    data: users,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => UserService.fetchAllUsers(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, portionsPages) => {
      if (!lastPage) return undefined;
      if (lastPage.data?.length < LIMIT) return undefined;

      return portionsPages.length * LIMIT;
    },
  });

  const allUsers = useMemo(() => {
    if (!users) return [];

    return users.pages.flatMap((page) => page.data ?? []);
  }, [users]);

  return (
    <Layout>
      <Stack
        direction="column"
        spacing={2}
        padding={4}
      >
        <UserCompound.List users={allUsers}>
          <Card
            variant="elevation"
            elevation={4}
            sx={{ padding: 2 }}
          >
            <UserCompound.Container>
              <Stack
                direction="row"
                spacing={2}
              >
                <UserCompound.Username />
                <UserCompound.Id />
              </Stack>
            </UserCompound.Container>
          </Card>
        </UserCompound.List>
        {hasNextPage && <Button onClick={() => fetchNextPage()}>Load More</Button>}
      </Stack>
    </Layout>
  );
}
