import { PostRepository } from "../database/post";
import { Post } from "../entity/post";
import logger from "../logger";
import { TagService } from "./tag";

interface PostService {
  createPost(post: Post): void;
  removePost(id: string): void;
  updatePost(id: string, post: Partial<Post>): void;
  getPosts(): Post[];
  getPost(id: string): Post | null;
}

class PostServiceImpl implements PostService {
  private repository: PostRepository;
  private tagService: TagService;

  constructor(repository: PostRepository, tagService: TagService) {
    this.repository = repository;
    this.tagService = tagService;
  }

  createPost(post: Post): void {
    this.repository.create(post);
  }

  removePost(id: string): void {
    this.repository.remove(id);
  }

  updatePost(id: string, post: Partial<Post>): void {
    this.repository.update(id, post);
  }

  getPosts(): Post[] {
    const posts = this.repository.findAll();
    return posts.map((post) => {
      return {
        ...post,
        tags: this.tagService.getTagsByPost(post.id),
      };
    });
  }

  getPost(id: string): Post | null {
    const post = this.repository.find(id);
    if (post === null) {
      logger.warn(`Unable to find post ${id}`);
      return null;
    }
    return {
      ...post,
      tags: this.tagService.getTagsByPost(post.id),
    };
  }
}

export { PostService, PostServiceImpl };
