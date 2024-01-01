import { describe, expect, test, vi } from "vitest";
import { postTagRepository } from "./post_tag.js";

const query = await vi.hoisted(async () => {
  const { setup, query } = await import("../database.mock.js");
  await setup();
  return query;
});

describe("find", async () => {
  test("empty", async () => {
    expect(postTagRepository.find({})).rejects.toThrowError("Empty postTag");
  });

  test("by post_id", async () => {
    query.mockResolvedValue({
      rows: [
        { post_id: "hello-world", tag_id: "note" },
        { post_id: "hello-world", tag_id: "default" },
        { post_id: "hello-world", tag_id: "life" },
      ],
    });
    const postTags = await postTagRepository.find({ postId: "hello-world" });
    expect(query).toBeCalledWith("SELECT * FROM post_tag WHERE post_id = $1", [
      "hello-world",
    ]);
    expect(postTags).toEqual([
      { postId: "hello-world", tagId: "note" },
      { postId: "hello-world", tagId: "default" },
      { postId: "hello-world", tagId: "life" },
    ]);
  });

  test("by tag_id", async () => {
    query.mockResolvedValue({
      rows: [
        { post_id: "hello-world", tag_id: "default" },
        { post_id: "dying", tag_id: "default" },
      ],
    });
    const postTags = await postTagRepository.find({ tagId: "default" });
    expect(query).toBeCalledWith("SELECT * FROM post_tag WHERE tag_id = $1", [
      "default",
    ]);
    expect(postTags).toEqual([
      { postId: "hello-world", tagId: "default" },
      { postId: "dying", tagId: "default" },
    ]);
  });
});

describe("create", async () => {
  test("normal call", async () => {
    await postTagRepository.create("hello-world", "default");
    expect(query).toBeCalledWith(
      "INSERT INTO post_tag (post_id, tag_id) VALUES ($1, $2)",
      ["hello-world", "default"],
    );
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
    expect(query).toBeCalledWith(
      "DELETE FROM post_tag WHERE post_id = $1 AND tag_id = $2",
      ["hello-world", "default"],
    );
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
