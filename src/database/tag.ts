import { objectToSQL, withClient } from "../database.js";
import { Tag } from "../entity/tag.js";

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
    const result = await withClient(
      async (client) =>
        await client.query("SELECT * FROM tag WHERE id = $1", [id]),
    );
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
    const result = await withClient(
      async (client) => await client.query("SELECT * FROM tag"),
    );
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
    const { sql, values } = objectToSQL(tag, ["id"]);
    if (values.length === 0) {
      throw new Error("Empty tag");
    }
    await withClient(
      async (client) =>
        await client.query(
          `UPDATE tag SET ${sql} WHERE id = $${values.length + 1}`,
          [...values, id],
        ),
    );
  }

  async create(tag: Tag): Promise<void> {
    if (tag.id.length === 0 || tag.name.length === 0) {
      throw new Error("Empty id or name");
    }
    await withClient(
      async (client) =>
        await client.query("INSERT INTO tag (id, name) VALUES ($1, $2)", [
          tag.id,
          tag.name,
        ]),
    );
  }

  async remove(id: string): Promise<void> {
    if (id.length === 0) {
      throw new Error("Empty id");
    }
    await withClient(
      async (client) =>
        await client.query("DELETE FROM tag WHERE id = $1", [id]),
    );
  }
}

const tagRepository = new TagRepositoryImpl();

export { TagRepository, TagRepositoryImpl, tagRepository };
