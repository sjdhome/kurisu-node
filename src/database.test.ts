import { test, expect, describe } from "vitest";
import { objectToSQL } from "./database";

describe("objectToSQL", async () => {
  test("normal call", async () => {
    const result = objectToSQL({
      username: "sjdhome",
      postId: "hello-world",
    });
    expect(result.sql).toBe("username = $1, post_id = $2");
    expect(result.values).toStrictEqual(["sjdhome", "hello-world"]);
  });
  test("exclude id", async () => {
    const result = objectToSQL(
      {
        id: 666,
        postId: "hello-world",
      },
      ["id"],
    );
    expect(result.sql).toBe("post_id = $1");
    expect(result.values).toStrictEqual(["hello-world"]);
  });
});
