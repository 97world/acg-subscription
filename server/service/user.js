const User = require('model/user');
const util = require('common/util');

async function get(id) {
  return await User.findById(id);
};

async function add(content) {
  const user = new User(content);
  await user.validate();
  user.password = util.encryptPassword(user.password);
  return await user.save();
};

async function del(id) {
  return await User.findByIdAndRemove(id);
};

async function update(content) {
  return await User.findByIdAndUpdate(content.id, content);
};

async function find(query) {
  return await User.find(query);
};

async function findOne(query) {
  return await User.findOne(query);
};

module.exports = {
  find,
  findOne,
  get,
  add,
  del,
  update,
};