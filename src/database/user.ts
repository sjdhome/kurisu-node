import { User } from "../entity/user.js";
import { getClient } from "./postgresql.js";

interface UserRepository {
  find(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<User>): Promise<void>;
  create(user: User): Promise<void>;
  remove(id: string): Promise<void>;
}

class UserRepositoryImpl implements UserRepository {
  async find(id: string): Promise<User | null> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM user WHERE id = $1", [id]);
    client.release();
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    const user: User = {
      id: row.id,
      username: row.username,
      avatar: row.avatar,
      password: row.password,
      permission: row.permission,
    };
    return user;
  }

  async findAll(): Promise<User[]> {
    const client = await getClient();
    const result = await client.query("SELECT * FROM user");
    client.release();
    return result.rows.map((row) => {
      const user: User = {
        id: row.id,
        username: row.username,
        avatar: row.avatar,
        password: row.password,
        permission: row.permission,
      };
      return user;
    });
  }

  async update(id: string, user: Partial<User>): Promise<void> {
    const client = await getClient();
    for (const [key, value] of Object.entries(user)) {
      await client.query(`UPDATE user SET ${key} = $1 WHERE id = $2`, [
        value,
        id,
      ]);
    }
    client.release();
  }

  async create(user: User): Promise<void> {
    const client = await getClient();
    await client.query(
      "INSERT INTO user (id, username, avatar, password, permission) VALUES ($1, $2, $3, $4, $5)",
      [user.id, user.username, user.avatar, user.password, user.permission],
    );
    client.release();
  }

  async remove(id: string): Promise<void> {
    const client = await getClient();
    await client.query("DELETE FROM user WHERE id = $1", [id]);
    client.release();
  }
}

export { UserRepository };
