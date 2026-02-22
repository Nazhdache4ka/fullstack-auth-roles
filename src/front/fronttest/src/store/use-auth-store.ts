import { create } from 'zustand';
import type { IUser } from '../interface';

interface IAuthStore {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  isAuth: false,
  setIsAuth: (isAuth) => set({ isAuth }),
  user: null,
  setUser: (user) => set({ user }),
}));
