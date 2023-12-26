# v1 API Docs

v1 API refers to the crude API design during the _kurisu-go_ period.

In order to reduce the cost of front-end migration during the transition period, I prefixed all APIs at that time with `/v1/`, such as `/v1/blog/post/`.

The v1 API will be deprecated after migration is completed.

## API List

| Path                       | Description                |
| -------------------------- | -------------------------- |
| /v1/blog/post/             | Metadata of all posts.     |
| /v1/blog/post/:id/         | Metadata of the `id` post/ |
| /v1/blog/post/:id/content/ | Content of the `id` post.  |
