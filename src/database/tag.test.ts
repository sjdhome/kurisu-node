import { describe, vi, test, beforeAll, expect, beforeEach } from "vitest";
import { TagRepository, TagRepositoryImpl } from "./tag.js";

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

let tagRepository: TagRepository;

beforeAll(() => {
  tagRepository = new TagRepositoryImpl();
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
          id: "default",
          name: "Default",
        },
      ],
    });
    const tag = await tagRepository.find("default");
    expect(mocks.query).toHaveBeenCalledWith(
      "SELECT * FROM tag WHERE id = $1",
      ["default"]
    );
    expect(tag).toEqual({
      id: "default",
      name: "Default",
    });
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty", async () => {
    mocks.query.mockResolvedValue({ rows: [] });
    expect(tagRepository.find("")).rejects.toThrowError("Empty id");
  });

  test("not found", async () => {
    mocks.query.mockResolvedValue({ rows: [] });
    const tag = await tagRepository.find("balabala");
    expect(tag).toBeNull();
    expect(mocks.release).toHaveBeenCalled();
  });
});

describe("findAll", async () => {
  test("normal call", async () => {
    mocks.query.mockResolvedValue({
      rows: [
        {
          id: "default",
          name: "Default",
        },
        {
          id: "note",
          name: "Note",
        },
      ],
    });
    const tags = await tagRepository.findAll();
    expect(mocks.query).toHaveBeenCalledWith("SELECT * FROM tag");
    expect(tags).toEqual([
      {
        id: "default",
        name: "Default",
      },
      {
        id: "note",
        name: "Note",
      },
    ]);
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty", async () => {
    mocks.query.mockResolvedValue({ rows: [] });
    const tags = await tagRepository.findAll();
    expect(tags).toEqual([]);
    expect(mocks.release).toHaveBeenCalled();
  });
});

describe("update", async () => {
  test("normal call", async () => {
    await tagRepository.update("default", { name: "Fault" });
    expect(mocks.query).toHaveBeenCalledWith(
      "UPDATE tag SET name = $1 WHERE id = $2",
      ["Fault", "default"]
    );
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty id", async () => {
    expect(tagRepository.update("", { name: "Default" })).rejects.toThrowError(
      "Empty id"
    );
  });

  test("empty tag", async () => {
    expect(
      tagRepository.update("default", { id: "fault" })
    ).rejects.toThrowError("Empty tag");
  });
});

describe("create", async () => {
  test("normal call", async () => {
    await tagRepository.create({ id: "default", name: "Default" });
    expect(mocks.query).toHaveBeenCalledWith(
      "INSERT INTO tag (id, name) VALUES ($1, $2)",
      ["default", "Default"]
    );
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty id", async () => {
    expect(
      tagRepository.create({ id: "", name: "Default" })
    ).rejects.toThrowError("Empty id or name");
  });

  test("empty name", async () => {
    expect(
      tagRepository.create({ id: "default", name: "" })
    ).rejects.toThrowError("Empty id or name");
  });

  test("both empty", async () => {
    expect(tagRepository.create({ id: "", name: "" })).rejects.toThrowError(
      "Empty id or name"
    );
  });
});

describe("remove", async () => {
  test("normal call", async () => {
    await tagRepository.remove("default");
    expect(mocks.query).toHaveBeenCalledWith("DELETE FROM tag WHERE id = $1", [
      "default",
    ]);
    expect(mocks.release).toHaveBeenCalled();
  });

  test("empty id", async () => {
    expect(tagRepository.remove("")).rejects.toThrowError("Empty id");
  });
});
