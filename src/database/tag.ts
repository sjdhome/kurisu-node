import { snakeCase } from "change-case";
import { Tag } from "../entity/tag.js";
import { getClient } from "./postgresql.js";

interface TagRepository {
  find(id: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  update(id: string, tag: Partial<Tag>): Promise<void>;
  create(tag: Tag): Promise<void>;
  remove(id: string): Promise<void>;
}

class TagRepositoryImpl implements TagRepository {
  async find(id: string): Promise<Tag | null> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM tag WHERE id = $1", [id]);
    client.release();
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    const tag: Tag = {
      id: row.id,
      name: row.name,
    };
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM tag");
    client.release();
    return result.rows.map((row) => {
      const tag: Tag = {
        id: row.id,
        name: row.name,
      };
      return tag;
    });
  }

  async update(id: string, tag: Partial<Omit<Tag, "id">>): Promise<void> {
    const client = await getClient();
    for (const [key, value] of Object.entries(tag)) {
      await client.query(
        `UPDATE tag SET ${snakeCase(key)} = $1 WHERE id = $2`,
        [value, id]
      );
    }
    client.release();
  }

  async create(tag: Tag): Promise<void> {
    const client = await getClient();
    await client.query("INSERT INTO tag (id, name) VALUES ($1, $2)", [
      tag.id,
      tag.name,
    ]);
    client.release();
  }

  async remove(id: string): Promise<void> {
    const client = await getClient();
    await client.query("DELETE FROM tag WHERE id = $1", [id]);
    client.release();
  }
}

export { TagRepository };
