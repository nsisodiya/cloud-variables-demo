const fp = require('fastify-plugin');
const mongoose = require('mongoose');

var allCollections = {};
export default fp(function(fastify, opts, next) {
  console.log('========= hello======= ', { opts });
  //TODO remove hardcoding of /cloudvariables' variable
  fastify.post('/cloudvariables', async (request, reply) => {
    try {
      const { collectionName, action, data } = request.body;
      const mongoose = fastify.mongoose.instance;
      if (allCollections[collectionName] === undefined) {
        allCollections[collectionName] = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
      }
      var Model = allCollections[collectionName];
      switch (action) {
        case 'createDocument':
          var d = await new Model(data).save();
          return { status: 'success', document: d };
        case 'getAllDocuments':
          var allD = await Model.find();
          return { status: 'success', collection: allD };
        case 'updateDocument':
          const { _id } = data;
          delete data._id;
          /**if (!task) {res.status(400).json({ error: 'No task with the given ID' });} else {res.json({ task: task });}*/
          var d = await Model.findByIdAndUpdate(_id, { $set: data }, { new: true });
          return { status: 'success', document: d };
        default:
          reply
            .code(400)
            .type('application/json; charset=utf-8')
            .send({ status: 'failure', errorMessage: `Unknown action ${action}` });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  next();
});
