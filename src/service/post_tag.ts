import { postRepository } from "../database/post.js";
import { postTagRepository } from "../database/post_tag.js";
import { tagRepository } from "../database/tag.js";
import { Post } from "../entity/post.js";
import { Tag } from "../entity/tag.js";

interface PostTagService {
  bind(postId: string, tagId: string): Promise<void>;
  unbind(postId: string, tagId: string): Promise<void>;
  getTagsByPost(postId: string): Promise<Tag[]>;
  getPostsByTag(tagId: string): Promise<Post[]>;
}

class PostTagServiceImpl implements PostTagService {
  async bind(postId: string, tagId: string): Promise<void> {
    await postTagRepository.create(postId, tagId);
  }

  async unbind(postId: string, tagId: string): Promise<void> {
    await postTagRepository.remove(postId, tagId);
  }

  async getTagsByPost(postId: string): Promise<Tag[]> {
    const postTags = await postTagRepository.find({ postId });
    const tagIds = postTags.map((postTag) => postTag.tagId);
    const tags = [];
    for (const tagId of tagIds) {
      const tag = await tagRepository.find(tagId);
      if (tag === null) {
        throw new Error(`Tag ${tagId} not found`);
      }
      tags.push(tag);
    }
    return tags;
  }

  async getPostsByTag(tagId: string): Promise<Post[]> {
    const postTags = await postTagRepository.find({ tagId });
    const postIds = postTags.map((postTag) => postTag.postId);
    const posts = [];
    for (const postId of postIds) {
      const post = await postRepository.find(postId);
      if (post === null) {
        throw new Error(`Post ${postId} not found`);
      }
      posts.push(post);
    }
    return posts;
  }
}

const postTagService = new PostTagServiceImpl();

export { PostTagService, postTagService };
