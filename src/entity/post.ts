import { Tag } from "./tag";

interface Post {
  id: string;
  title: string;
  created: string;
  edited: string;
  author: string;
  tags: Tag[];
  description: string;
  commentable: boolean;
  visible: boolean;
  pinToTop: boolean;
  content: string;
}

export { Post };
