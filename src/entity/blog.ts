import { Post } from "./post";

interface Blog {
  name: string;
  motto: string;
  adminUsername: string;
  posts: Post[];
}

export { Blog };
