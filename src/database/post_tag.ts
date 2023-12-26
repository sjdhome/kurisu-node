import { snakeCase } from "change-case";
import { PostTag } from "../entity/post_tag.js";
import { getClient } from "../postgresql.js";

interface PostTagRepository {
  find(postTag: Partial<PostTag>): Promise<PostTag[]>;
  create(postId: string, tagId: string): Promise<void>;
  remove(postId: string, tagId: string): Promise<void>;
}

class PostTagRepositoryImpl implements PostTagRepository {
  async find(postTag: Partial<PostTag>): Promise<PostTag[]> {
    if (Object.entries(postTag).length === 0) {
      throw new Error("Empty postTag");
    }

    const client = await getClient();

    const conditions: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(postTag)) {
      conditions.push(`${snakeCase(key)} = $${values.length + 1}`);
      values.push(value);
    }

    const query = `SELECT * FROM post_tag WHERE ${conditions.join(" AND ")}`;
    const result = await client.query(query, values);
    client.release();

    return result.rows.map((row) => ({
      postId: row.post_id,
      tagId: row.tag_id,
    }));
  }

  async create(postId: string, tagId: string): Promise<void> {
    if (postId.length === 0 || tagId.length === 0) {
      throw new Error("Empty postId or tagId");
    }
    const client = await getClient();
    await client.query(
      "INSERT INTO post_tag (post_id, tag_id) VALUES ($1, $2)",
      [postId, tagId]
    );
    client.release();
  }

  async remove(postId: string, tagId: string): Promise<void> {
    if (postId.length === 0 || tagId.length === 0) {
      throw new Error("Empty postId or tagId");
    }
    const client = await getClient();
    await client.query(
      "DELETE FROM post_tag WHERE post_id = $1 AND tag_id = $2",
      [postId, tagId]
    );
    client.release();
  }
}

const postTagRepository = new PostTagRepositoryImpl();

export { PostTagRepository, PostTagRepositoryImpl, postTagRepository };
