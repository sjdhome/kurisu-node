import { objectToSQL, withClient } from "../database.js";
import { Post } from "../entity/post.js";

interface PostRepository {
  find(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  update(id: string, post: Partial<Post>): Promise<void>;
  create(post: Post): Promise<void>;
  remove(id: string): Promise<void>;
}

class PostRepositoryImpl implements PostRepository {
  async find(id: string): Promise<Post | null> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
    const result = await withClient(
      async (client) =>
        await client.query("SELECT * FROM post WHERE id = $1", [id]),
    );
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
    const result = await withClient(
      async (client) => await client.query("SELECT * FROM post"),
    );
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

  async update(id: string, post: Partial<Post>): Promise<void> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
    if (Object.entries(post).length === 0) {
      throw new Error("Empty post");
    }
    const { sql, values } = objectToSQL(post, ["id"]);
    await withClient(
      async (client) =>
        await client.query(
          `UPDATE post SET ${sql} WHERE id = $${values.length + 1}`,
          [...values, id],
        ),
    );
  }

  async create(post: Post): Promise<void> {
    await withClient(
      async (client) =>
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
        ),
    );
  }

  async remove(id: string): Promise<void> {
    await withClient(
      async (client) =>
        await client.query("DELETE FROM post WHERE id = $1", [id]),
    );
  }
}

const postRepository = new PostRepositoryImpl();

export { PostRepository, PostRepositoryImpl, postRepository };
