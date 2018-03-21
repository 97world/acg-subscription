const path = require('path');
const request = require('superagent');
const cheerio = require('cheerio');
const template = require('art-template');

const log = require('../../common/log');
const util = require('../../common/util');

const logger = log.loggers.get('monitor');

async function sendNotification(checkResult) {
  let option = {
    to: '97world@gmail.com',
    subject: `Hello, 您的订阅有新发现 ${checkResult.monitorURL}`,
    html: template('../../common/tpl/email-notify.art', checkResult.data),
  };
  await uti.sendMail(option);
};

/**
 * @typedef     {Object}   CheckResult
 * @property    {Number}   code - (-1 => cannot find any result, 0 => no update, 1 => discovery update but same episode number, 2 => discovery update and not same episode number)
 * @property    {Object}   episode - episode info
 */

/**
 * check if the page is updated
 *
 * @param      {String}  html - the page html content
 * @return     {CheckResult} - return check result 
 */
function checkPage(html, task) {
  const $ = cheerio.load(html);
  const topicList = $('#topic_list tbody>tr');
  let checkResult = {};
  if (topicList.length) {
    const latestItem = topicList.first();
    const latestItemURL = latestItem.find('.title>a').attr('href');
    const latestItemName = latestItem.find('.title>a').text().trim();
    const latestItemEpisodeInfo = util.getEpisodeInfo(latestItemName);
    if (!task.latestItemURL || latestItemURL === task.latestItemURL) {
      checkResult.code = 0;
    } else {
      checkResult.code = latestItemEpisodeInfo.episodeStr === task.episodeInfo.episodeStr ? 1 : 2;
    }
    checkResult.data = {};
    checkResult.data.monitorURL = task.url;
    checkResult.data.name = latestItemName;
    checkResult.data.url = latestItemURL;
    checkResult.data.episodeStr = latestItemEpisodeInfo.episodeStr;
    checkResult.data.episodeNum = latestItemEpisodeInfo.episodeNum;
    task.latestItemURL = latestItemURL;
    task.episodeInfo = latestItemEpisodeInfo;
  } else {
    checkResult.code = -1;
  }
  return checkResult;
};

async function monitor(taskList) {
  taskList = taskList.filter(task => !task.disabled);

  const taskTotal = taskList.length;
  for (let i = 0; i < taskTotal; i ++) {
    const task = taskList[i];
    const pageURL = task.url;
    const response = await request.get(pageURL);
    const checkResult = checkPage(response.text, task);
    switch (checkResult.code) {
      case -1:
        logger.warn('cannot find any result, continue, URL = %s', pageURL);
        break;
      case 0:
        logger.info('this page not be update, continue, pageURL = %s, episodeStr = %s, episodeNum = %s',
                      pageURL, checkResult.data.episodeStr, checkResult.data.episodeNum);
        break;
      case 1:
        logger.info('this page is update, but same episode with last , pageURL = %s, episodeStr = %s, episodeNum = %s',
                      pageURL, checkResult.data.episodeStr, checkResult.data.episodeNum);
        task.isNotify4SameEpisode && await sendNotification(checkResult);
        break;
      case 2:
        logger.info('the page is update, pageURL = %s, episodeStr = %s, episodeNum = %s',
                      pageURL, latestItemEpisodeInfo.episodeStr, latestItemEpisodeInfo.episodeNum,);
        await sendNotification(checkResult);
        break;
      default:
        logger.warn('unknown check code');
        break;
    }
    await util.wait(2000);
  }
  logger.info('check task list finish, sleep 60s');
  await util.wait(60000);
  await monitor(taskList);
};

module.exports = monitor;