import { Pool } from "pg";

const pool = new Pool();

async function getClient() {
  return await pool.connect();
}

export { getClient };
