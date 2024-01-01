import { snakeCase } from "change-case";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
});

/**
 * @deprecated use withClient() instead.
 */
async function getClient() {
  return await pool.connect();
}

async function withClient<T>(
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  const result = await fn(client);
  client.release();
  return result;
}

function objectToSQL(
  object: any,
  excludes: string[] = [],
): { sql: string; values: any[] } {
  const keys: string[] = [];
  const values: any[] = [];
  for (const [key, value] of Object.entries(object)) {
    if (excludes.includes(key)) {
      continue;
    }
    keys.push(`${snakeCase(key)} = $${keys.length + 1}`);
    values.push(value);
  }
  return {
    sql: keys.join(", "),
    values,
  };
}

export { getClient, withClient, objectToSQL };
