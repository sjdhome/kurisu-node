import process from "process";
import logger from "./logger.js";
import fastify from "fastify";
import { getPosts, getPost, getPostContent } from "./controller/v1/post.js";

const app = fastify();
const port = Number.parseInt(process.env.PORT || "3000");

app.get("/v1/blog/post/", getPosts);
app.get("/v1/blog/post/:id/", getPost);
app.get("/v1/blog/post/:id/content/", getPostContent);

logger.info(`Server listening on port ${port}.`);
try {
  await app.listen({ port });
} catch (err) {
  logger.error("Server down!");
  logger.error(err);
  process.exit(1);
}

export { app };
