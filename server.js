import fastifyLib from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import fastifyCloudVariable from './server/fastify-cloud-variables';

const fastify = fastifyLib({ logger: true });

fastify.register(
  require('fastify-mongoose-driver'),
  {
    uri: 'mongodb://localhost:32768/sample-app-database',
    settings: {
      useNewUrlParser: true,
      config: {
        autoIndex: true
      }
    },
    models: [],
    useNameAndAlias: true
  },
  (err) => {
    if (err) throw err;
  }
);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'static')
  //prefix: "/public/" // optional: default '/'
});
fastify.register(fastifyCloudVariable, {
  x: 'y'
});

// Declare a route
fastify.get('/hello', async (request, reply) => {
  return { hello: 'world' };
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
