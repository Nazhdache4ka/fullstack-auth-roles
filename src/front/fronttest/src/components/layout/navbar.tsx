import { useAuthStore } from '../../store/use-auth-store';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar } from '@mui/material';
import { UserRole } from '../../interface';
import { useNavbar } from './hooks/use-navbar';

export function Navbar() {
  const { isAuth, user } = useAuthStore();

  const { isPending, handleLogout } = useNavbar();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            My App
          </Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 0.5 }}>
            {isAuth ? (
              <>
                {user?.role === UserRole.ADMIN && (
                  <Button
                    component={Link}
                    to="/admin"
                    sx={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/posts"
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Posts
                </Button>
                <Button
                  component={Link}
                  to="/users"
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Users List
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="error"
                  disabled={isPending}
                >
                  Logout
                </Button>
                <Avatar
                  sx={{ bgcolor: 'secondary.main', marginLeft: 3 }}
                  alt={user?.username}
                >
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {user?.username.charAt(0).toUpperCase()}
                  </Button>
                </Avatar>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
