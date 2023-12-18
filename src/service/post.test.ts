import { expect, test } from "@jest/globals";

import { PostServiceImpl } from "./post";
import { PostRepository } from "../database/post";
import { TagService } from "./tag";
import { Tag } from "../entity/tag";

test("Merge tags into posts", async () => {
  const mockRepo = {
    find(_: string) {
      return {};
    },
    findAll() {
      return [{}, {}, {}];
    },
  } as PostRepository;
  const mockTagService = {
    getTagsByPost(_id) {
      return mockTags;
    },
  } as TagService;
  const mockTags: Tag[] = [
    {
      id: "test",
      name: "Test",
    },
  ];
  const postService = new PostServiceImpl(mockRepo, mockTagService);
  expect(postService.getPost("test")!.tags).toBe(mockTags);
  expect(postService.getPosts()).toStrictEqual([
    { tags: mockTags },
    { tags: mockTags },
    { tags: mockTags },
  ]);
});
