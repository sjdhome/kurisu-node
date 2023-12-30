import process from "process";
import logger from "./logger.js";
import fastify from "fastify";
import { getPosts, getPost, getPostContent } from "./controller/v1/post.js";

const app = fastify();
const port = Number.parseInt(process.env.PORT || "3000");

app.get("/v1/blog/post/", getPosts);
app.get("/v1/blog/post/:id/", getPost);
app.get("/v1/blog/post/:id/content/", getPostContent);

app.setNotFoundHandler((request, reply) => {
  logger.warn(
    `${request.ip} try to access ${request.url}, and it's not found.`,
  );
  reply.statusCode = 404;
  return "There is no such page. How did you get here?";
});

app.setErrorHandler((error, request, reply) => {
  logger.error(error, `It's triggered by ${request.ip}`);
  reply.statusCode = 500;
  return "Server internal error, please contact the administrator.";
});

logger.info(`Running on port ${port}`);
try {
  await app.listen({ port });
} catch (err) {
  logger.error("Server down!");
  logger.error(err);
  process.exit(1);
}

export { app };
