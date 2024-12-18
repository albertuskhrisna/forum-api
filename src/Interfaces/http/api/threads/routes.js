const routes = (handler) => (
  [
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: (request) => handler.getThreadByIdHandler(request),
    },
    {
      method: 'POST',
      path: '/threads',
      handler: (request, h) => handler.postThreadHandler(request, h),
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: (request, h) => handler.postThreadCommentHandler(request, h),
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handler: (request) => handler.deleteThreadCommentHandler(request),
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/threads/{threadId}/comments/{commentId}/likes',
      handler: (request) => handler.toggleCommentLikesHandler(request),
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handler: (request, h) => handler.postCommentReplyHandler(request, h),
      options: {
        auth: 'forumapi_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
      handler: (request) => handler.deleteCommentReplyHandler(request),
      options: {
        auth: 'forumapi_jwt',
      },
    },
  ]
);

module.exports = routes;
