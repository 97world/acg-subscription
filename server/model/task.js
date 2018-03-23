const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const taskSchema = new Schema({
  url: { type: String },
  checkedAt: { type: Date },
  latestURL: { type: String },
  latestEpisodeStr: { type: String },
  latestEpisodeNum: { type: Number },
  notifyStatus: { type: Number },               // 0: disable notify, 1: always notify, 2: notify when different episodeNum
  disabled: { type: Boolean },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('task', taskSchema, 'task');