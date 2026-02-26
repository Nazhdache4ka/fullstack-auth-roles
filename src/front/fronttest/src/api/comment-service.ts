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

  async editComment(postId: number, content: string, commentId: number): Promise<IComment> {
    return axios
      .put(`${BACKEND_URL}/posts/${postId}/comments`, { content, commentId }, { withCredentials: true })
      .then((res) => res.data);
  }

  async deleteComment(postId: number, commentId: number): Promise<boolean> {
    return axios
      .delete(`${BACKEND_URL}/posts/${postId}/comments/${commentId}`, { withCredentials: true })
      .then((res) => res.status === 200);
  }
}

export default new CommentService();
