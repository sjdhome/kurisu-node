import { describe, test, expect, vi } from "vitest";
import { getPost, getPostContent } from "./post.js";
import { FastifyReply, FastifyRequest } from "fastify";

const mocks = vi.hoisted(() => {
  return {
    getPost: vi.fn(),
    getTagsByPost: vi.fn(),
  };
});

vi.mock("../../service/post.js", () => {
  return {
    postService: {
      getPost: mocks.getPost,
    },
  };
});

vi.mock("../../service/post_tag.js", () => {
  return {
    postTagService: {
      getTagsByPost: mocks.getTagsByPost,
    },
  };
});

describe("getPost", async () => {
  test("should return a post with tags", async () => {
    mocks.getPost.mockResolvedValueOnce({
      id: "hello-world",
      title: "Hello world",
      created: "2023-03-13T07:00:00.000Z",
      edited: "2023-03-13T07:00:00.000Z",
      author: "sjdhome",
      description: "你好，世界！这是本博客的第一篇文章。",
      commentable: true,
      visible: true,
      pinToTop: false,
      content: "Hello!",
    });
    mocks.getTagsByPost.mockResolvedValueOnce([{ id: "none", name: "无" }]);
    const reply = {
      type: vi.fn((contentType: string): FastifyReply => reply),
    } as unknown as FastifyReply;
    const response = await getPost(
      { params: { id: "hello-world" } } as FastifyRequest,
      reply,
    );
    expect(JSON.parse(response as string)).toEqual({
      id: "hello-world",
      title: "Hello world",
      created: "2023-03-13T07:00:00.000Z",
      edited: "2023-03-13T07:00:00.000Z",
      author: "sjdhome",
      description: "你好，世界！这是本博客的第一篇文章。",
      commentable: true,
      visible: true,
      pinToTop: false,
      tags: ["无"],
    });
    expect(reply.statusCode).toBeUndefined();
    expect(reply.type).toBeCalledWith("application/json");
  });
  test("should return 404 when post is not found", async () => {
    const reply = { statusCode: 200, type: vi.fn() } as unknown as FastifyReply;
    mocks.getPost.mockResolvedValueOnce(null);
    const response = await getPost(
      { params: { id: "balabala" } } as FastifyRequest,
      reply,
    );
    expect(response).toBeUndefined();
    expect(reply.statusCode).toBe(404);
    expect(reply.type).toBeCalledTimes(0);
  });
});

describe("getPostContent", async () => {
  test("should return a post content", async () => {
    mocks.getPost.mockResolvedValueOnce({
      id: "hello-world",
      title: "Hello world",
      created: "2023-03-13T07:00:00.000Z",
      edited: "2023-03-13T07:00:00.000Z",
      author: "sjdhome",
      description: "你好，世界！这是本博客的第一篇文章。",
      commentable: true,
      visible: true,
      pinToTop: false,
      content: "Hello!",
    });
    mocks.getTagsByPost.mockResolvedValueOnce([{ id: "none", name: "无" }]);
    const reply = { type: vi.fn() } as unknown as FastifyReply;
    const response = await getPostContent(
      { params: { id: "hello-world" } } as FastifyRequest,
      reply,
    );
    expect(response).toEqual("Hello!");
    expect(reply.statusCode).toBeUndefined();
    expect(reply.type).toBeCalledWith("text/markdown; charset=utf-8");
  });

  test("should return 404 when post is not found", async () => {
    const reply = { statusCode: 200, type: vi.fn() } as unknown as FastifyReply;
    mocks.getPost.mockResolvedValueOnce(null);
    const response = await getPostContent(
      { params: { id: "balabala" } } as FastifyRequest,
      reply,
    );
    expect(response).toBeUndefined();
    expect(reply.statusCode).toBe(404);
    expect(reply.type).toBeCalledTimes(0);
  });
});
