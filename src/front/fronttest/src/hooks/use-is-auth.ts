import { useEffect, useState } from 'react';
import { AuthService } from '../api/auth-service';
import { useAuthStore } from '../store/use-auth-store';

export function useIsAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await AuthService.refresh();
        setIsAuth(true);
        setUser(res.data.user);
        localStorage.setItem('accessToken', res.data.accessToken);
      } catch {
        setIsAuth(false);
        setUser(null);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setIsAuth, setUser]);

  return { isLoading };
}
