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

async function find(query) {
  return await Topic.find(query);
};

async function findOne(query) {
  return await Topic.findOne(query);
};

module.exports = {
  find,
  findOne,
  get,
  add,
  del,
  update,
};