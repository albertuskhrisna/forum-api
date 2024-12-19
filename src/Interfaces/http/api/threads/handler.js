const AddThreadUseCase = require('../../../../Applications/useCases/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/useCases/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/useCases/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/useCases/GetThreadDetailUseCase');
const AddReplyUseCase = require('../../../../Applications/useCases/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/useCases/DeleteReplyUseCase');
const ToggleCommentLikesUseCase = require('../../../../Applications/useCases/ToggleCommentLikesUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async getThreadByIdHandler(request) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
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

  async toggleCommentLikesHandler(request) {
    const toggleCommentLikesUseCase = this._container.getInstance(ToggleCommentLikesUseCase.name);
    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    await toggleCommentLikesUseCase.execute(userId, commentId, threadId);

    return {
      status: 'success',
    };
  }

  async postCommentReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { commentId, threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const addedReply = await addReplyUseCase.execute(userId, commentId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { replyId, threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    await deleteReplyUseCase.execute(replyId, commentId, threadId, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
