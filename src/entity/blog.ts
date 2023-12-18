import Post from "./post";
import User from "./user";

interface Blog {
  name: string;
  motto: string;
  admin: User;
  posts: Post[];
}

export default Blog;
