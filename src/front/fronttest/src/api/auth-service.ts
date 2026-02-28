import axios from 'axios';
import type { IAuthResponse, CustomApiResponse } from '../interface';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export class AuthService {
  static async register(username: string, password: string): CustomApiResponse<IAuthResponse> {
    return axios.post<IAuthResponse>(`${BACKEND_URL}/auth/register`, { username, password }, { withCredentials: true });
  }

  static async login(username: string, password: string): CustomApiResponse<IAuthResponse> {
    return axios.post<IAuthResponse>(`${BACKEND_URL}/auth/login`, { username, password }, { withCredentials: true });
  }

  static async logout(): Promise<void> {
    return axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
  }

  static async refresh(): CustomApiResponse<IAuthResponse> {
    return axios.post<IAuthResponse>(`${BACKEND_URL}/auth/refresh`, {}, { withCredentials: true });
  }
}
