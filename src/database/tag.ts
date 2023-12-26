import { snakeCase } from "change-case";
import { Tag } from "../entity/tag.js";
import { getClient } from "../postgresql.js";

interface TagRepository {
  find(id: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  update(id: string, tag: Partial<Tag>): Promise<void>;
  create(tag: Tag): Promise<void>;
  remove(id: string): Promise<void>;
}

class TagRepositoryImpl implements TagRepository {
  async find(id: string): Promise<Tag | null> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
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

  async update(id: string, tag: Partial<Tag>): Promise<void> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
    const conditions = [];
    const values = [];
    for (const [key, value] of Object.entries(tag)) {
      if (key === "id") {
        continue;
      }
      conditions.push(`${snakeCase(key)} = $${conditions.length + 1}`);
      values.push(value);
    }
    if (conditions.length === 0) {
      throw new Error("Empty tag");
    }
    const client = await getClient();
    await client.query(
      `UPDATE tag SET ${conditions.join(", ")} WHERE id = $${
        conditions.length + 1
      }`,
      [...values, id],
    );
    client.release();
  }

  async create(tag: Tag): Promise<void> {
    if (tag.id.length === 0 || tag.name.length === 0) {
      throw new Error("Empty id or name");
    }
    const client = await getClient();
    await client.query("INSERT INTO tag (id, name) VALUES ($1, $2)", [
      tag.id,
      tag.name,
    ]);
    client.release();
  }

  async remove(id: string): Promise<void> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
    const client = await getClient();
    await client.query("DELETE FROM tag WHERE id = $1", [id]);
    client.release();
  }
}

const tagRepository = new TagRepositoryImpl();

export { TagRepository, TagRepositoryImpl, tagRepository };
