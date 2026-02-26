import type { AxiosResponse } from 'axios';

export interface IPost {
  id: number;
  author: string;
  title: string;
  content: string;
}

export interface IUser {
  username: string;
  id: number;
  role: string;
  ipAddress?: string;
  userAgent?: string;
  lastLoginAt?: string;
}

export interface IComment {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  content: string;
  is_edited: number;
  role: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export type CustomApiResponse<T> = Promise<AxiosResponse<T>>;

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
