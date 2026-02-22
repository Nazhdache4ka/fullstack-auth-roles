import axios from 'axios';
import type { IPost } from '../interface';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class PostService {
  async fetchAllPosts(limit: number = 10, offset: number): Promise<IPost[] | null> {
    try {
      const response = await axios.get(`${BACKEND_URL}/posts?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async fetchPostById(id: number): Promise<IPost | null> {
    try {
      const response = await axios.get(`${BACKEND_URL}/posts/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async deletePost(id: number): Promise<boolean> {
    try {
      await axios.delete(`${BACKEND_URL}/posts/${id}`);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async createPost(author: string, title: string, content: string): Promise<boolean> {
    try {
      await axios.post(`${BACKEND_URL}/posts`, { author, title, content });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updatePost(id: number, author: string, title: string, content: string): Promise<boolean> {
    try {
      await axios.put(`${BACKEND_URL}/posts`, { id, author, title, content });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default new PostService();
