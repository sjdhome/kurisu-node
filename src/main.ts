import process from "process";
import Koa, { Context, Next } from "koa";
import Router from "@koa/router";
import logger from "./logger.js";
import { getPost, getPosts } from "./controller/post.js";
import { getPostsByTag, getTagsByPost } from "./controller/post_tag.js";

const app = new Koa();
const port = process.env.PORT ?? 3000;

const router = new Router();
router.get("/blog/post", getPosts);
router.get("/blog/post/:id", getPost);
router.get("/blog/post/:id/tag", getTagsByPost);
router.get("/blog/tag/:id/post", getPostsByTag);

const request2log = async (ctx: Context, next: Next) => {
  logger.info(ctx);
  await next();
};

app
  .use(request2log)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);
