process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

const Koa = require('koa');
const koaRouter = require('koa-router');
const mongoose = require('mongoose');
const log = require('common/log');
const spider = require('lib/spider');
const monitor = require('lib/monitor');

const server = new Koa();
const logger = log.loggers.get('server');

server.listen(3000);

logger.info('start koa server success, port = %d', 3000);

mongoose.connect('mongodb://127.0.0.1/acg-subscription');
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
  logger.info('open database connection successfully.');
});
mongoose.connection.on('error', err => {
  logger.error('open database connection failed. Error=%s', err);
});

// spider('https://share.dmhy.org/topics/list?keyword=%E6%B5%B7%E8%B4%BC%E7%8E%8B&sort_id=0&team_id=34&order=date-desc');
// spider('https://share.dmhy.org/topics/list?keyword=%E5%8F%8C%E6%98%9F&sort_id=0&team_id=90&order=date-desc');

// let taskList = [
//   {
//     url: 'https://share.dmhy.org/topics/list?keyword=%E6%97%8F%E6%8B%BC%7C%E9%BE%8D%E8%BF%B7',  // 龙族拼图
//     checkedAt: null,
//     latestItemURL: '',
//     disabled: false,
//     episodeInfo: null,
//     isNotify4SameEpisode: false,
//   },
//   {
//     url: 'https://share.dmhy.org/topics/list?keyword=%E4%BA%94%E8%91%89%E8%8D%89',  // 黑色五叶草
//     checkedAt: null,
//     latestItemURL: '',
//     disabled: false,
//     episodeInfo: null,
//     isNotify4SameEpisode: true,
//   },
// ];
// monitor(taskList);

module.exports = server;