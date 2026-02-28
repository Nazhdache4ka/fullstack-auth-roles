import axios from 'axios';
import type { IUser, CustomApiResponse } from '../interface';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export class UserService {
  static async fetchAllUsers(limit: number = 10, offset: number): CustomApiResponse<IUser[]> {
    return axios.get<IUser[]>(`${BACKEND_URL}/users?limit=${limit}&offset=${offset}`, { withCredentials: true });
  }

  static async fetchUsersInfoForAdmin(): CustomApiResponse<IUser[]> {
    return axios.get<IUser[]>(`${BACKEND_URL}/users/info`, { withCredentials: true });
  }

  static async setUserRole(userId: number, roleId: number): CustomApiResponse<void> {
    return axios.patch<void>(`${BACKEND_URL}/users/role`, { userId, roleId }, { withCredentials: true });
  }
}
