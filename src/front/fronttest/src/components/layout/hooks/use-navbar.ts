import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../../../api/auth-service';
import { useAuthStore } from '../../../store/use-auth-store';
import { useNavigate } from 'react-router-dom';

export function useNavbar() {
  const { setIsAuth, setUser } = useAuthStore();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      setIsAuth(false);
      setUser(null);
      navigate('/');
      localStorage.removeItem('accessToken');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logout();
  };

  return { isPending, handleLogout };
}
