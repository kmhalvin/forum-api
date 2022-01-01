const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    options: {
      handler: handler.postAuthenticationHandler,
      validate: {
        payload: Joi.object({
          username: Joi.string(),
          password: Joi.string(),
        }),
        failAction: 'ignore',
      },
      tags: ['api'],
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    options: {
      handler: handler.putAuthenticationHandler,
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string(),
        }),
        failAction: 'ignore',
      },
      tags: ['api'],
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    options: {
      handler: handler.deleteAuthenticationHandler,
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string(),
        }),
        failAction: 'ignore',
      },
      tags: ['api'],
    },
  },
]);

module.exports = routes;
