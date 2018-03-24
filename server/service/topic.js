const Topic = require('model/topic');

async function get(id) {
  return await Topic.findById(id);
};

async function add(content) {
  const topic = new Topic(content);
  await topic.validate();
  return await topic.save();
};

async function del(id) {
  return await Topic.findByIdAndRemove(id);
};

async function update(content) {
  return await Topic.findByIdAndUpdate(content.id, content);
};

module.exports = {
  findOne: Topic.findOne,
  find: Topic.find,
  where: Topic.where,
  get,
  add,
  del,
  update,
};