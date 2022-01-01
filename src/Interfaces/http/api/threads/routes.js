const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      handler: handler.postThreadHandler,
      validate: {
        payload: Joi.object({
          title: Joi.string(),
          body: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    options: {
      handler: handler.getThreadHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
        }),
        failAction: 'ignore',
      },
      tags: ['api'],
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      handler: handler.postThreadCommentHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
        }),
        payload: Joi.object({
          content: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      handler: handler.deleteThreadCommentHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
          commentId: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: {
      handler: handler.postThreadReplyHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
          commentId: Joi.string(),
        }),
        payload: Joi.object({
          content: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: {
      handler: handler.deleteThreadReplyHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
          commentId: Joi.string(),
          replyId: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: {
      handler: handler.PutThreadCommentLikesHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
          commentId: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    options: {
      handler: handler.PutThreadReplyLikesHandler,
      validate: {
        params: Joi.object({
          threadId: Joi.string(),
          commentId: Joi.string(),
          replyId: Joi.string(),
        }),
        failAction: 'ignore',
      },
      auth: 'forum_jwt',
      tags: ['api'],
    },
  },
]);

module.exports = routes;
