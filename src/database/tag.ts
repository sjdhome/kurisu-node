import { Tag } from "../entity/tag";

interface TagRepository {
  find(id: string): Tag | null;
  findByPost(id: string): Tag[];
  findAll(): Tag[];
  update(id: string, tag: Partial<Tag>): void;
  create(tag: Tag): void;
  remove(id: string): void;
}

export { TagRepository };
