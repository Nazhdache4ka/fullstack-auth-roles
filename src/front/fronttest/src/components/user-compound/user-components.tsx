import type { PropsWithChildren } from 'react';
import { useCurrentUser, UserProvider } from './user-context';
import type { IUser } from '../../interface';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

export function UserList({ users, children }: PropsWithChildren<{ users: IUser[] }>) {
  if (!users?.length) return <div>No users found</div>;

  return (
    <>
      {users.map((user) => (
        <UserProvider
          key={user.id}
          user={user}
        >
          {children}
        </UserProvider>
      ))}
    </>
  );
}

export function UserContainer({ children }: PropsWithChildren) {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return children;
}

export function UserUsername() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>Username:</strong> {user.username}
    </Typography>
  );
}

export function UserId() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>ID:</strong> {user.id}
    </Typography>
  );
}

export function UserRole() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>Role:</strong> {user.role}
    </Typography>
  );
}

export function UserIpAddress() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>IP Address:</strong> {user.ipAddress}
    </Typography>
  );
}

export function UserUserAgent() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>User Agent:</strong> {user.userAgent}
    </Typography>
  );
}

export function UserLastLoginAt() {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <Typography variant="h6">
      <strong>Last seen:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
    </Typography>
  );
}
export function SetUserRole({ handleSetRole }: { handleSetRole: (role: string, userId: number) => void }) {
  const user = useCurrentUser();

  if (!user) return <div>User not found</div>;

  return (
    <FormControl>
      <InputLabel id="role-label">Role</InputLabel>
      <Select
        labelId="role-label"
        id="role-select"
        value={user.role}
        label="Role"
        onChange={(e) => handleSetRole(e.target.value, user.id)}
      >
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </Select>
    </FormControl>
  );
}
