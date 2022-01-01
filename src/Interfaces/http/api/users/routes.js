const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    options: {
      handler: handler.postUserHandler,
      validate: {
        payload: Joi.object({
          username: Joi.string(),
          password: Joi.string(),
          fullname: Joi.string(),
        }),
        failAction: 'ignore',
      },
      tags: ['api'],
    },
  },
]);

module.exports = routes;
