import { User } from "../entity/user.js";
import { getClient } from "../database.js";

interface UserRepository {
  create(user: Omit<User, "id">): Promise<void>;
  remove(id: number): Promise<void>;
  findById(id: number): Promise<User>;
  findByUsername(username: string): Promise<User>;
  update(id: number, user: Partial<User>): Promise<void>;
}

// class UserRepositoryImpl implements UserRepository {
//   async create(user: Omit<User, "id">): Promise<void> {
//     if (user.username.length === 0) {
//       throw new Error("Invalid username");
//     }
//     if (user.hashedPassword.length === 0) {
//       throw new Error("Invalid password");
//     }
//     const client = await getClient();
//     await client.query("INSERT INTO user (username, hashedPassword) VALUES ($1, $2)", [user.username, user.hashedPassword]);
//     client.release();
//   }

//   async remove(id: number): Promise<void> {

//   }
// }
