const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/comments/entities/Reply');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { threadId, content, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, threadId, owner, null, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsWithRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT c.id as id, u.username as username,
c.date as date, c.content as content, c.replied_to as reply,
c.is_delete as deleted, COUNT(l) as like_count
FROM comments c
JOIN users u ON u.id = c.owner
LEFT JOIN likes l ON l.comment_id = c.id
WHERE c.thread_id = $1
GROUP BY c.id, u.username
ORDER BY c.replied_to NULLS FIRST, c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return this.GroupRepliesByComments(result.rows);
  }

  GroupRepliesByComments(commentRows) {
    const comments = [];
    commentRows.forEach((row) => {
      if (!row.reply) {
        comments.push(new Comment({ ...row, replies: [], likeCount: +row.like_count }));
      } else {
        comments[comments.findIndex(({ id }) => id === row.reply)]
          .replies.push(new Reply({ ...row }));
      }
    });
    return comments;
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCommentById(threadId, id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE thread_id = $1 AND id = $2 RETURNING id',
      values: [threadId, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan di database');
    }
  }

  async addReply(addReply) {
    const {
      threadId, commentId, content, owner,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, threadId, owner, commentId, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteReplyById(threadId, commentId, id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE thread_id = $1 AND replied_to = $2 AND id = $3 RETURNING id',
      values: [threadId, commentId, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('balasan tidak ditemukan di database');
    }
  }
}

module.exports = CommentRepositoryPostgres;
