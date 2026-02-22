import { createContext, useContext } from 'react';
import type { IUser } from '../../interface';

const UserContext = createContext<IUser | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentUser() {
  const user = useUserContext();
  return user;
}

export function UserProvider({ user, children }: { user: IUser; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
