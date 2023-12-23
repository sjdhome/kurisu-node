import { PostTag } from "../entity/post_tag.js";
import { getClient } from "./postgresql.js";

interface PostTagRepository {
  findByPost(postId: string): Promise<PostTag[]>;
  findByTag(tagId: string): Promise<PostTag[]>;
  bind(postId: string, tagId: string): Promise<void>;
  unbind(postId: string, tagId: string): Promise<void>;
}

class PostTagRepositoryImpl implements PostTagRepository {
  async findByPost(postId: string): Promise<PostTag[]> {
    const client = await getClient();
    const result = await client.query(
      "SELECT * FROM post_tag WHERE post_id = $1",
      [postId],
    );
    client.release();
    return result.rows.map((row) => {
      const postTag: PostTag = {
        postId: row.post_id,
        tagId: row.tag_id,
      };
      return postTag;
    });
  }

  async findByTag(tagId: string): Promise<PostTag[]> {
    const client = await getClient();
    const result = await client.query(
      "SELECT * FROM post_tag WHERE tag_id = $1",
      [tagId],
    );
    client.release();
    return result.rows.map((row) => {
      const postTag: PostTag = {
        postId: row.post_id,
        tagId: row.tag_id,
      };
      return postTag;
    });
  }

  async bind(postId: string, tagId: string): Promise<void> {
    const client = await getClient();
    await client.query(
      "INSERT INTO post_tag (post_id, tag_id) VALUES ($1, $2)",
      [postId, tagId],
    );
    client.release();
  }

  async unbind(postId: string, tagId: string): Promise<void> {
    const client = await getClient();
    await client.query(
      "DELETE FROM post_tag WHERE post_id = $1 AND tag_id = $2",
      [postId, tagId],
    );
    client.release();
  }
}

export { PostTagRepository };
