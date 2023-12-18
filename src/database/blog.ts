import { Blog } from "../entity/blog";

interface BlogRepository {
  find(): Blog | null;
  update(blog: Partial<Blog>): void;
}

export { BlogRepository };
