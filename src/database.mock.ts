import { beforeAll, vi } from "vitest";
import { PoolClient } from "pg";

const query = vi.fn();

async function setup() {
  const real = await vi.importActual("./database.js");
  vi.doMock("./database.js", () => ({
    ...real,
    withClient: async <T>(
      fn: (client: PoolClient) => Promise<T>,
    ): Promise<T> => {
      return await fn({ query } as unknown as PoolClient);
    },
  }));
  beforeAll(() => {
    query.mockClear();
  });
}

export { setup, query };
