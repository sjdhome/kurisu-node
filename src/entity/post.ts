import { TagId } from "./tag";

type PostId = string;

interface Post {
  id: PostId;
  title: string;
  created: string;
  edited: string;
  author: string;
  tags: TagId[];
  description: string;
  commentable: boolean;
  visible: boolean;
  pinToTop: boolean;
  content: string;
}

export { PostId };
export default Post;
