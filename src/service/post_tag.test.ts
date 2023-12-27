import { describe, test, expect, vi } from "vitest";
import { postTagService } from "./post_tag";

const mocks = vi.hoisted(() => ({
  postFind: vi.fn(),
  postTagFind: vi.fn(),
  tagFind: vi.fn(),
}));

vi.mock("../database/post.js", () => {
  const postRepository = {
    find: mocks.postFind,
  };
  return { postRepository };
});

vi.mock("../database/post_tag.js", () => {
  const postTagRepository = {
    find: mocks.postTagFind,
  };
  return { postTagRepository };
});

vi.mock("../database/tag.js", () => {
  const tagRepository = {
    find: mocks.tagFind,
  };
  return { tagRepository };
});

describe("getTagsByPost", async () => {
  test("normal call", async () => {
    mocks.postTagFind.mockResolvedValueOnce([
      { postId: "hello-world", tagId: "default" },
      { postId: "hello-world", tagId: "none" },
      { postId: "hello-world", tagId: "balabala" },
    ]);
    const result = [
      { id: "default", name: "Default" },
      { id: "none", name: "None" },
      { id: "balabala", name: "Balabala" },
    ];
    for (const tag of result) {
      mocks.tagFind.mockResolvedValueOnce(tag);
    }
    const tags = await postTagService.getTagsByPost("hello-world");
    expect(tags).toStrictEqual(result);
  });

  test("empty id", async () => {
    expect(postTagService.getTagsByPost("")).rejects.toThrowError(
      "Empty postId",
    );
  });
});

describe("getPostsByTag", async () => {
  test("normal call", async () => {
    mocks.postTagFind.mockResolvedValueOnce([
      { postId: "hello-world", tagId: "default" },
      { postId: "goodbye-world", tagId: "default" },
      { postId: "hello-again-world", tagId: "default" },
    ]);
    const result = [
      { id: "hello-world" },
      { id: "goodbye-world" },
      { id: "hello-again-world"},
    ];
    for (const post of result) {
      mocks.postFind.mockResolvedValueOnce(post);
    }
    const tags = await postTagService.getPostsByTag("default");
    expect(tags).toStrictEqual(result);
  });

  test("empty id", async () => {
    expect(postTagService.getPostsByTag("")).rejects.toThrowError(
      "Empty tagId",
    );
  });
});
