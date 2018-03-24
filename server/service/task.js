const Task = require('model/task');

async function get(id) {
  return await Task.findById(id);
};

async function add(content) {
  const task = new Task(content);
  await task.validate();
  return await task.save();
};

async function del(id) {
  return await Task.findByIdAndRemove(id);
};

async function update(content) {
  return await Task.findByIdAndUpdate(content.id, content);
};

module.exports = {
  findOne: Task.findOne,
  find: Task.find,
  where: Task.where,
  get,
  add,
  del,
  update,
};