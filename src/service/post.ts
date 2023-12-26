import { postRepository } from "../database/post.js";
import { Post } from "../entity/post.js";

interface PostService {
  createPost(post: Post): Promise<void>;
  removePost(id: string): Promise<void>;
  updatePost(id: string, post: Partial<Post>): Promise<void>;
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  getPostsByYear(year: number): Promise<Post[]>;
}

class PostServiceImpl implements PostService {
  async createPost(post: Post): Promise<void> {
    await postRepository.create(post);
  }

  async removePost(id: string): Promise<void> {
    await postRepository.remove(id);
  }

  async updatePost(id: string, post: Partial<Post>): Promise<void> {
    await postRepository.update(id, post);
  }

  async getPosts(): Promise<Post[]> {
    return await postRepository.findAll();
  }

  async getPost(id: string): Promise<Post | null> {
    return await postRepository.find(id);
  }

  async getPostsByYear(year: number): Promise<Post[]> {
    throw new Error("Not implemented");
  }
}

const postService = new PostServiceImpl();

export { PostService, postService };
