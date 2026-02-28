import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { AuthService } from '../../../api/auth-service';
import { useAuthStore } from '../../../store/use-auth-store';
import type { IAuthResponse } from '../../../interface';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [errorMessage, setErrorMessage] = useState<string>('Failed to login');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const navigate = useNavigate();

  const { setIsAuth, setUser } = useAuthStore();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await AuthService.login(username, password);
      return res.data;
    },
    onSuccess: (data: IAuthResponse) => {
      setIsAuth(true);
      setUser(data.user);
      navigate('/');
      localStorage.setItem('accessToken', data.accessToken);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to login';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const { mutate: register, isPending: isRegisterPending } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await AuthService.register(username, password);
      return res.data;
    },
    onSuccess: (data: IAuthResponse) => {
      setIsAuth(true);
      setUser(data.user);
      navigate('/');
      localStorage.setItem('accessToken', data.accessToken);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message ?? 'Failed to register';
      setErrorMessage(message);
      setOpenSnackbar(true);
    },
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return { isPending, isRegisterPending, errorMessage, openSnackbar, login, register, handleCloseSnackbar };
}
