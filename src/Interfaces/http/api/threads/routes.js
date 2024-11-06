const routes = (handler) => (
  [
    {
      method: 'POST',
      path: '/threads',
      handler: (request, h) => handler.postThreadHandler(request, h),
      options: {
        auth: 'forumapi_jwt',
      },
    },
  ]
);

module.exports = routes;
