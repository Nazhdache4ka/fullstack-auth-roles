import axios from 'axios';
import type { IComment } from '../interface';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class CommentService {
  async createComment(postId: number, content: string): Promise<boolean> {
    return axios.post(`${BACKEND_URL}/posts/${postId}/comment`, { content }, { withCredentials: true });
  }

  async fetchCommentsByPostId(postId: number): Promise<IComment[]> {
    return axios.get(`${BACKEND_URL}/posts/${postId}/comments`, { withCredentials: true }).then((res) => res.data);
  }
}

export default new CommentService();
