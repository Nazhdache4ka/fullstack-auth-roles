import axios from 'axios';
import type { IUser, CustomApiResponse } from '../interface';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class UserService {
  async fetchAllUsers(limit: number = 10, offset: number): CustomApiResponse<IUser[]> {
    return axios.get<IUser[]>(`${BACKEND_URL}/users?limit=${limit}&offset=${offset}`, { withCredentials: true });
  }

  async fetchUsersInfoForAdmin(): CustomApiResponse<IUser[]> {
    return axios.get<IUser[]>(`${BACKEND_URL}/users/info`, { withCredentials: true });
  }

  async setUserRole(userId: number, roleId: number): CustomApiResponse<void> {
    return axios.patch<void>(`${BACKEND_URL}/users/role`, { userId, roleId }, { withCredentials: true });
  }
}

export default new UserService();
