import { User } from "../entity/user";

interface UserRepository {
  find(id: string): User | null;
  findAll(): User[];
  update(id: string, user: Partial<User>): void;
  create(user: User): void;
  remove(id: string): void;
}

export { UserRepository };
