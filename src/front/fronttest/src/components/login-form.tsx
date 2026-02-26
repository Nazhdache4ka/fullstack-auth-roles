import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAuthStore } from '../store/use-auth-store';
import { useMutation } from '@tanstack/react-query';
import authService from '../api/auth-service';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { IAuthResponse } from '../interface';
import { ErrorAlert } from './error-alert';

export function LoginForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Invalid username or password');
  const { setIsAuth, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useMutation({
    mutationFn: async () => {
      const res = await authService.login(username, password);
      return res.data;
    },
    onSuccess: (data: IAuthResponse) => {
      setIsAuth(true);
      setUser(data.user);
      navigate('/');
      localStorage.setItem('accessToken', data.accessToken);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Invalid username or password';
      setErrorMessage(message);
      setUsername('');
      setPassword('');
      setOpenSnackbar(true);
    },
  });

  const handleLogin = () => {
    login();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
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

      <ErrorAlert
        open={openSnackbar}
        message={errorMessage}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
