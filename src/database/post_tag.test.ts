import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { PostTagRepository, PostTagRepositoryImpl } from "./post_tag.js";

const mocks = vi.hoisted(() => {
  return {
    query: vi.fn(),
    release: vi.fn(),
  };
});

vi.mock("../postgresql.js", () => {
  const getClient = vi.fn().mockReturnValue({
    query: mocks.query,
    release: mocks.release,
  });
  return { getClient };
});

let postTagRepository: PostTagRepository;

beforeAll(() => {
  postTagRepository = new PostTagRepositoryImpl();
});

beforeEach(() => {
  mocks.query.mockClear();
  mocks.release.mockClear();
});

describe("find", async () => {
  test("empty", async () => {
    mocks.query.mockResolvedValue({ rows: [] });
    expect(postTagRepository.find({})).rejects.toThrowError("Empty postTag");
  });

  test("by post_id", async () => {
    mocks.query.mockResolvedValue({
      rows: [
        { post_id: "hello-world", tag_id: "note" },
        { post_id: "hello-world", tag_id: "default" },
        { post_id: "hello-world", tag_id: "life" },
      ],
    });
    const postTags = await postTagRepository.find({ postId: "hello-world" });
    expect(mocks.query).toHaveBeenCalledWith(
      "SELECT * FROM post_tag WHERE post_id = $1",
      ["hello-world"],
    );
    expect(postTags).toEqual([
      { postId: "hello-world", tagId: "note" },
      { postId: "hello-world", tagId: "default" },
      { postId: "hello-world", tagId: "life" },
    ]);
    expect(mocks.release).toHaveBeenCalled();
  });

  test("by tag_id", async () => {
    mocks.query.mockResolvedValue({
      rows: [
        { post_id: "hello-world", tag_id: "default" },
        { post_id: "dying", tag_id: "default" },
      ],
    });
    const postTags = await postTagRepository.find({ tagId: "default" });
    expect(mocks.query).toHaveBeenCalledWith(
      "SELECT * FROM post_tag WHERE tag_id = $1",
      ["default"],
    );
    expect(postTags).toEqual([
      { postId: "hello-world", tagId: "default" },
      { postId: "dying", tagId: "default" },
    ]);
    expect(mocks.release).toHaveBeenCalled();
  });
});

describe("create", async () => {
  test("normal call", async () => {
    await postTagRepository.create("hello-world", "default");
    expect(mocks.query).toHaveBeenCalledWith(
      "INSERT INTO post_tag (post_id, tag_id) VALUES ($1, $2)",
      ["hello-world", "default"],
    );
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty postId", async () => {
    expect(postTagRepository.create("", "default")).rejects.toThrowError(
      "Empty postId or tagId",
    );
  });

  test("empty tagId", async () => {
    expect(postTagRepository.create("hello-world", "")).rejects.toThrowError(
      "Empty postId or tagId",
    );
  });
});

describe("remove", async () => {
  test("normal call", async () => {
    await postTagRepository.remove("hello-world", "default");
    expect(mocks.query).toHaveBeenCalledWith(
      "DELETE FROM post_tag WHERE post_id = $1 AND tag_id = $2",
      ["hello-world", "default"],
    );
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty postId", async () => {
    expect(postTagRepository.remove("", "default")).rejects.toThrowError(
      "Empty postId or tagId",
    );
  });

  test("empty tagId", async () => {
    expect(postTagRepository.remove("hello-world", "")).rejects.toThrowError(
      "Empty postId or tagId",
    );
  });
});
