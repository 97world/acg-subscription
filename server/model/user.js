const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String },
  role: { type: String },
  loginAt: { type: Date, default: Date.now },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema, 'user');