const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskSchema = new Schema({
  host: { type: String, require: true },
  url: { type: String, required: true, unique: true },
  checkedAt: { type: Date },
  latestURL: { type: String },
  latestEpisodeStr: { type: String },
  latestEpisodeNum: { type: Number },
  notifyStatus: { type: Number },               // 0: disable notify, 1: always notify, 2: notify when different episodeNum
  disabled: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('task', taskSchema, 'task');