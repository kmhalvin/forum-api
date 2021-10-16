require('dotenv').config();
const fs = require('fs');
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
  if (process.env.DYNO) {
    console.log('Running on Heroku...');
    fs.openSync('/tmp/app-initialized', 'w');
  }
})();
