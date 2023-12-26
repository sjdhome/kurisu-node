import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { PostRepository, PostRepositoryImpl } from "./post.js";

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

let postRepository: PostRepository;

beforeAll(() => {
  postRepository = new PostRepositoryImpl();
});

beforeEach(() => {
  mocks.query.mockClear();
  mocks.release.mockClear();
});

describe("find", async () => {
  test("normal call", async () => {
    mocks.query.mockResolvedValue({
      rows: [
        {
          id: "hello-world",
          title: "Hello World",
          created: "2023-03-13T07:00:00.000Z",
          edited: "2023-03-13T07:00:00.000Z",
          author: "sjdhome",
          description: "Hello World",
          commentable: true,
          visible: true,
          pin_to_top: false,
          content: "Hello World",
        },
      ],
    });
    const post = await postRepository.find("hello-world");
    expect(mocks.query).toHaveBeenCalledWith(
      "SELECT * FROM post WHERE id = $1",
      ["hello-world"],
    );
    expect(post).toEqual({
      id: "hello-world",
      title: "Hello World",
      created: "2023-03-13T07:00:00.000Z",
      edited: "2023-03-13T07:00:00.000Z",
      author: "sjdhome",
      description: "Hello World",
      commentable: true,
      visible: true,
      pinToTop: false,
      content: "Hello World",
    });
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  test("not found", async () => {
    mocks.query.mockResolvedValue({ rows: [] });
    const post = await postRepository.find("hello-world");
    expect(mocks.query).toHaveBeenCalledWith(
      "SELECT * FROM post WHERE id = $1",
      ["hello-world"],
    );
    expect(post).toBeNull();
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty id", async () => {
    expect(postRepository.find("")).rejects.toThrowError("Empty id");
  });
});

test("findAll", async () => {
  mocks.query.mockResolvedValue({
    rows: [
      {
        id: "hello-world",
        title: "Hello world",
        created: "2023-03-13T07:00:00.000Z",
        edited: "2023-03-13T07:00:00.000Z",
        author: "sjdhome",
        description: "你好，世界！这是本博客的第一篇文章。",
        commentable: true,
        visible: true,
        pin_to_top: false,
      },
      {
        id: "attributes-of-addictive-games",
        title: "成瘾游戏的属性",
        created: "2023-05-23T13:30:00.000Z",
        edited: "2023-05-23T13:30:00.000Z",
        author: "sjdhome",
        description: "我对成瘾游戏的片面看法。",
        commentable: true,
        visible: true,
        pin_to_top: false,
      },
    ],
  });
  const posts = await postRepository.findAll();
  expect(mocks.query).toHaveBeenCalledWith("SELECT * FROM post");
  expect(posts).toEqual([
    {
      id: "hello-world",
      title: "Hello world",
      created: "2023-03-13T07:00:00.000Z",
      edited: "2023-03-13T07:00:00.000Z",
      author: "sjdhome",
      description: "你好，世界！这是本博客的第一篇文章。",
      commentable: true,
      visible: true,
      pinToTop: false,
    },
    {
      id: "attributes-of-addictive-games",
      title: "成瘾游戏的属性",
      created: "2023-05-23T13:30:00.000Z",
      edited: "2023-05-23T13:30:00.000Z",
      author: "sjdhome",
      description: "我对成瘾游戏的片面看法。",
      commentable: true,
      visible: true,
      pinToTop: false,
    },
  ]);
  expect(mocks.release).toHaveBeenCalledOnce();
});

describe("update", async () => {
  test("normal call", async () => {
    await postRepository.update("hello-world", {
      title: "Goodbye World",
      pinToTop: true,
      content: "Never",
    });
    expect(mocks.query).toHaveBeenCalledWith(
      "UPDATE post SET title = $1, pin_to_top = $2, content = $3 WHERE id = $4",
      ["Goodbye World", true, "Never", "hello-world"],
    );
    await postRepository.update("hello-world", {
      title: "Goodbye World",
      content: "Never",
      pinToTop: true,
    });
    expect(mocks.query).toHaveBeenCalledWith(
      "UPDATE post SET title = $1, content = $2, pin_to_top = $3 WHERE id = $4",
      ["Goodbye World", "Never", true, "hello-world"],
    );
    expect(mocks.release).toHaveBeenCalledTimes(2);
  });

  test("empty id", async () => {
    expect(
      postRepository.update("", { title: "Goodbye World" }),
    ).rejects.toThrowError("Empty id");
  });

  test("empty post", async () => {
    expect(postRepository.update("hello-world", {})).rejects.toThrowError(
      "Empty post",
    );
  });
});
