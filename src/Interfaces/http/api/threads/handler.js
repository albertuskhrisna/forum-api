const AddThreadUseCase = require('../../../../Applications/useCases/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/useCases/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/useCases/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(userId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addedComment = await addCommentUseCase.execute(userId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    await deleteCommentUseCase.execute(commentId, threadId, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
