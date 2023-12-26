import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
});

async function getClient() {
  return await pool.connect();
}

export { getClient };
