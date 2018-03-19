const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const topicSchema = new Schema({
  name: { type: String },
  subTitleTeam: { type: String },
  magnetURL: { type: String },
  publishAt: { type: String },
  category: { type: String },
  type: { type: Number },       // 1: 动漫, 2: 剧场版, 3: 特别篇, 4: 全集 5: 漫画, 6: 游戏, 7: 音乐, 0: 其它
  size: { type: String },
  seeding: { type: String },
  downloading: { type: String },
  downloaded: { type: String },
  pageURL: { type: String },
  episodeNum: { type: Number },
  episodeStr: { type: String },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('topic', topicSchema, 'topic');