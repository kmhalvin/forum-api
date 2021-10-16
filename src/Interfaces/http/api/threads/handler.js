const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');
const LikeReplyUseCase = require('../../../../Applications/use_case/LikeReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    this.postThreadReplyHandler = this.postThreadReplyHandler.bind(this);
    this.deleteThreadReplyHandler = this.deleteThreadReplyHandler.bind(this);
    this.PutThreadCommentLikesHandler = this.PutThreadCommentLikesHandler.bind(this);
    this.PutThreadReplyLikesHandler = this.PutThreadReplyLikesHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postThreadCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({
      ...request.payload, threadId, owner,
    });

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
    const { id: owner } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ ...request.params, owner });

    return {
      status: 'success',
    };
  }

  async postThreadReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      ...request.payload, threadId, commentId, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadReplyHandler(request) {
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ ...request.params, owner });

    return {
      status: 'success',
    };
  }

  async PutThreadCommentLikesHandler(request) {
    const { id: owner } = request.auth.credentials;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute({ ...request.params, owner });

    return {
      status: 'success',
    };
  }

  async PutThreadReplyLikesHandler(request) {
    const { id: owner } = request.auth.credentials;
    const likeReplyUseCase = this._container.getInstance(LikeReplyUseCase.name);
    await likeReplyUseCase.execute({ ...request.params, owner });

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
