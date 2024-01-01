import { describe, vi, test, beforeAll, expect, beforeEach } from "vitest";
import { tagRepository } from "./tag.js";

const query = await vi.hoisted(async () => {
  const { setup, query } = await import("../database.mock.js");
  await setup();
  return query;
});

describe("find", async () => {
  test("normal call", async () => {
    query.mockResolvedValue({
      rows: [
        {
          id: "default",
          name: "Default",
        },
      ],
    });
    const tag = await tagRepository.find("default");
    expect(query).toHaveBeenCalledWith("SELECT * FROM tag WHERE id = $1", [
      "default",
    ]);
    expect(tag).toEqual({
      id: "default",
      name: "Default",
    });
  });

  test("empty", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(tagRepository.find("")).rejects.toThrowError("Empty id");
  });

  test("not found", async () => {
    query.mockResolvedValue({ rows: [] });
    const tag = await tagRepository.find("balabala");
    expect(tag).toBeNull();
  });
});

describe("findAll", async () => {
  test("normal call", async () => {
    query.mockResolvedValue({
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
    expect(query).toHaveBeenCalledWith("SELECT * FROM tag");
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
  });

  test("empty", async () => {
    query.mockResolvedValue({ rows: [] });
    const tags = await tagRepository.findAll();
    expect(tags).toEqual([]);
  });
});

describe("update", async () => {
  test("normal call", async () => {
    await tagRepository.update("default", { name: "Fault" });
    expect(query).toHaveBeenCalledWith(
      "UPDATE tag SET name = $1 WHERE id = $2",
      ["Fault", "default"],
    );
  });

  test("empty id", async () => {
    expect(tagRepository.update("", { name: "Default" })).rejects.toThrowError(
      "Empty id",
    );
  });

  test("empty tag", async () => {
    expect(
      tagRepository.update("default", { id: "fault" }),
    ).rejects.toThrowError("Empty tag");
  });
});

describe("create", async () => {
  test("normal call", async () => {
    await tagRepository.create({ id: "default", name: "Default" });
    expect(query).toHaveBeenCalledWith(
      "INSERT INTO tag (id, name) VALUES ($1, $2)",
      ["default", "Default"],
    );
  });

  test("empty id", async () => {
    expect(
      tagRepository.create({ id: "", name: "Default" }),
    ).rejects.toThrowError("Empty id or name");
  });

  test("empty name", async () => {
    expect(
      tagRepository.create({ id: "default", name: "" }),
    ).rejects.toThrowError("Empty id or name");
  });

  test("both empty", async () => {
    expect(tagRepository.create({ id: "", name: "" })).rejects.toThrowError(
      "Empty id or name",
    );
  });
});

describe("remove", async () => {
  test("normal call", async () => {
    await tagRepository.remove("default");
    expect(query).toHaveBeenCalledWith("DELETE FROM tag WHERE id = $1", [
      "default",
    ]);
  });

  test("empty id", async () => {
    expect(tagRepository.remove("")).rejects.toThrowError("Empty id");
  });
});
