const AddReply = require('../../Domains/comments/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(addReply.threadId);
    await this._commentRepository.verifyAvailableComment(addReply.commentId);
    return this._commentRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
