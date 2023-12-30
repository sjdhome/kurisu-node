import { FastifyReply, FastifyRequest } from "fastify";
import { Post } from "../../entity/post.js";
import logger from "../../logger.js";
import { postService } from "../../service/post.js";
import { postTagService } from "../../service/post_tag.js";

// GET /v1/blog/post/
async function getPosts(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<string> {
  const posts = await postService.getPosts();
  const postsWithTag = await Promise.all(
    posts.map(async (post) => {
      const tags = await postTagService.getTagsByPost(post.id);
      const tagNames = tags.map((tag) => tag.name);
      const postWithTags: Omit<Post & { tags: string[] }, "content"> & {
        content: string | undefined;
      } = { ...post, tags: tagNames };
      delete postWithTags.content;
      return postWithTags;
    }),
  );
  reply.type("application/json");
  logger.info(`${request.ip} GET /v1/blog/posts/`);
  return JSON.stringify(postsWithTag);
}

// GET /v1/blog/post/:id/
async function getPost(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<string | undefined> {
  const { id } = request.params as { id: string };
  const post = await postService.getPost(id);
  if (post === null) {
    logger.error(`Unable to get post ${id}`);
    reply.statusCode = 404;
    return;
  }
  const postWithTag: Omit<Post & { tags: string[] }, "content"> & {
    content: string | undefined;
  } = {
    ...post,
    tags: (await postTagService.getTagsByPost(post.id)).map((tag) => tag.name),
  };
  delete postWithTag.content;
  reply.type("application/json");
  logger.info(`${request.ip} GET /v1/blog/post/${id}/`);
  return JSON.stringify(postWithTag);
}

// GET /v1/blog/post/:id/content/
async function getPostContent(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<string | undefined> {
  const { id } = request.params as { id: string };
  const post = await postService.getPost(id);
  if (post === null) {
    logger.error(`Unable to get post ${id}`);
    reply.statusCode = 404;
    return;
  }
  reply.type("text/markdown; charset=utf-8");
  logger.info(`${request.ip} GET /v1/blog/post/${id}/content/`);
  return post.content;
}

export { getPost, getPostContent, getPosts };
