import { tagRepository } from "../database/tag.js";
import { Tag } from "../entity/tag.js";
import logger from "../logger.js";

interface TagService {
  createTag(tag: Tag): Promise<void>;
  removeTag(id: string): Promise<void>;
  updateTag(id: string, tag: Partial<Tag>): Promise<void>;
  getTag(id: string): Promise<Tag | null>;
}

class TagServiceImpl implements TagService {
  async createTag(tag: Tag): Promise<void> {
    tagRepository.create(tag);
  }

  async removeTag(id: string): Promise<void> {
    tagRepository.remove(id);
  }

  async updateTag(id: string, tag: Partial<Tag>): Promise<void> {
    tagRepository.update(id, tag);
  }

  async getTag(id: string): Promise<Tag | null> {
    const tag = await tagRepository.find(id);
    if (tag === null) {
      logger.error(`Unable to get tag ${id}`);
      return null;
    }
    return tag;
  }
}

const tagService = new TagServiceImpl();

export { TagService, tagService };
