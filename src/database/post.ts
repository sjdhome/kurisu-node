import { Post } from "../entity/post";

type PostWithoutTags = Omit<Post, "tags">;

interface PostRepository {
  find(id: string): PostWithoutTags | null;
  findAll(): PostWithoutTags[];
  update(id: string, post: Partial<PostWithoutTags>): void;
  create(post: PostWithoutTags): void;
  remove(id: string): void;
}

export { PostRepository, PostWithoutTags };
