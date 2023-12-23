interface Post {
  id: string;
  title: string;
  created: string;
  edited: string;
  author: string;
  description: string;
  commentable: boolean;
  visible: boolean;
  pinToTop: boolean;
  content: string;
}

export { Post };
