import { Layout, UserCompound } from '../components';
import { useAuthStore } from '../store/use-auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserService from '../api/user-service';
import { UserRole } from '../interface';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Card, CardActions, Stack, Typography } from '@mui/material';

export function AdminPanel() {
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => UserService.fetchUsersInfoForAdmin(),
    enabled: currentUser?.role === UserRole.ADMIN,
  });

  const { mutate: setRole } = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => UserService.setUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const usersArray = useMemo(() => {
    if (!users) return [];
    return users?.data?.filter((user) => user.id !== currentUser?.id);
  }, [currentUser, users]);

  useEffect(() => {
    if (currentUser?.role !== UserRole.ADMIN) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSetRole = (role: string, userId: number) => {
    const roleId = role === UserRole.ADMIN ? 1 : 2;
    setRole({ userId, roleId });
  };

  const emoji = '\u{1F607}';

  return (
    <Layout>
      <Stack
        direction="column"
        spacing={2}
        padding={4}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ width: 50, height: 50, backgroundColor: 'primary.main' }}>{emoji}</Avatar>
          <Typography variant="h6">Welcome to the admin panel, {currentUser?.username}!</Typography>
        </Box>
        <Stack
          direction="column"
          spacing={2}
        >
          <UserCompound.List users={usersArray}>
            <Card
              variant="elevation"
              elevation={4}
              sx={{ padding: 2 }}
            >
              <UserCompound.Container>
                <UserCompound.Username />
                <UserCompound.Role />
                <UserCompound.IpAddress />
                <UserCompound.UserAgent />
                <UserCompound.LastLoginAt />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <UserCompound.SetRole handleSetRole={handleSetRole} />
                </CardActions>
              </UserCompound.Container>
            </Card>
          </UserCompound.List>
        </Stack>
      </Stack>
    </Layout>
  );
}
