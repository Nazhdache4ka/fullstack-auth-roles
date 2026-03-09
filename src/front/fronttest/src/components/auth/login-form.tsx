import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { ErrorAlert } from '../layout/error-alert';
import { useAuth } from './hooks/use-auth';

export function LoginForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { isPending, errorMessage, openSnackbar, login, handleCloseSnackbar } = useAuth();

  const handleLogin = () => {
    login({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <Box
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          color="primary"
        >
          Login
        </Typography>
        <TextField
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={handleLogin}
          disabled={isPending}
          variant="outlined"
          color="primary"
        >
          Login
        </Button>
      </Box>
      <ErrorAlert
        open={openSnackbar}
        message={errorMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}
