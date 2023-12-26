import { FastifyReply, FastifyRequest } from "fastify";
import { postService } from "../../service/post.js";
import logger from "../../logger.js";
import { postTagService } from "../../service/post_tag.js";

// URL: /v1/blog/post/
async function getPosts(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<string> {
  const posts = await postService.getPosts();
  const postsWithTag = await Promise.all(
    posts.map(async (post) => {
      const tags = await postTagService.getTagsByPost(post.id);
      const tagNames = tags.map((tag) => tag.name);
      return { ...post, tags: tagNames };
    }),
  );
  reply.type("application/json");
  return JSON.stringify(postsWithTag);
}

// URL: /v1/blog/post/:id/
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
  const postWithTag: any = {
    ...post,
    tags: (await postTagService.getTagsByPost(post.id)).map((tag) => tag.name),
  };
  delete postWithTag.content;
  reply.type("application/json");
  return JSON.stringify(postWithTag);
}

// URL: /v1/blog/post/content/
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
  return post.content;
}

export { getPosts, getPost, getPostContent };
