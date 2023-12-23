import { Post } from "../entity/post.js";
import { getClient } from "./postgresql.js";
import { snakeCase } from "change-case";

interface PostRepository {
  find(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  update(id: string, post: Partial<Post>): Promise<void>;
  create(post: Post): Promise<void>;
  remove(id: string): Promise<void>;
}

class PostRepositoryImpl implements PostRepository {
  async find(id: string): Promise<Post | null> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM post WHERE id = $1", [id]);
    client.release();
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    const post: Post = {
      id: row.id,
      title: row.title,
      created: row.created,
      edited: row.edited,
      author: row.author,
      description: row.description,
      commentable: row.commentable,
      visible: row.visible,
      pinToTop: row.pin_to_top,
      content: row.content,
    };
    return post;
  }

  async findAll(): Promise<Post[]> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM post");
    client.release();
    return result.rows.map((row) => {
      const post: Post = {
        id: row.id,
        title: row.title,
        created: row.created,
        edited: row.edited,
        author: row.author,
        description: row.description,
        commentable: row.commentable,
        visible: row.visible,
        pinToTop: row.pin_to_top,
        content: row.content,
      };
      return post;
    });
  }

  async update(id: string, post: Partial<Omit<Post, "id">>): Promise<void> {
    const client = await getClient();
    for (const [key, value] of Object.entries(post)) {
      await client.query(
        `UPDATE post SET ${snakeCase(key)} = $1 WHERE id = $2`,
        [value, id],
      );
    }
    client.release();
  }

  async create(post: Post): Promise<void> {
    const client = await getClient();
    await client.query(
      "INSERT INTO post (id, title, created, edited, author, description, commentable, visible, pin_to_top, content) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        post.id,
        post.title,
        post.created,
        post.edited,
        post.author,
        post.description,
        post.commentable,
        post.visible,
        post.pinToTop,
        post.content,
      ],
    );
    client.release();
  }

  async remove(id: string): Promise<void> {
    const client = await getClient();
    await client.query("DELETE FROM post WHERE id = $1", [id]);
    client.release();
  }
}

export { PostRepository };
