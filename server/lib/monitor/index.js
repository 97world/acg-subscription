const request = require('superagent');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const log = require('../../common/log');
const util = require('../../common/util');

const logger = log.loggers.get('monitor');

async function sendNotification(sendInfo) {
  const user = 'no-reply@dtoweb.com';
  const pass = 'YDn9uxr8cfYxPdLR';
  const mailTransport = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secureConnection: true,
    auth: { user, pass },
  });
  const mailOption = {
    from: 'no-reply@dtoweb.com',
    to: sendInfo.email,
    subject: '您的订阅有新发现~',
    text: `您的订阅页面, ${sendInfo.monitorURL} \n` +
          `新发现的内容 \n` +
            `* name: ${sendInfo.name} \n` +
            `* episodeStr: ${sendInfo.episodeStr} \n` +
            `* episodeNum: ${sendInfo.episodeNum} \n` +
            `* pageLink: ${sendInfo.pageLink}`
  };
  const sendResult = await mailTransport.sendMail(mailOption);
  logger.info(
    'send notification to %s success, sendResult = %s',
    sendInfo.email, sendResult, JSON.stringify(sendResult),
  );
};

async function monitor(taskList) {
  taskList = taskList.filter(task => {
    return !task.disabled;
  });
  const taskNum = taskList.length;
  for (let i = 0; i < taskNum; i ++) {
    const task = taskList[i];
    const pageURL = task.url;
    const response = await request.get(pageURL);
    const pageHTML = response.text;
    const $ = cheerio.load(pageHTML);
    const topicList = $('#topic_list tbody>tr');
    if (topicList.length) {
      const latestItem = topicList.first();
      const latestItemURL = latestItem.find('.title>a').attr('href');
      const latestItemName = latestItem.find('.title>a').text().trim();
      const latestEpisodeInfo = util.getEpisodeInfo(latestItemName);
      if (!task.latestItemURL || latestItemURL === task.latestItemURL) {
        logger.info(
          'this page not be update, continue, pageURL = %s, episodeStr = %s, episodeNum = %s',
          pageURL, latestEpisodeInfo.episodeStr, latestEpisodeInfo.episodeNum,
        );
      } else {
        logger.info(
          'the page is update, pageURL = %s, episodeStr = %s, episodeNum = %s',
          pageURL, latestEpisodeInfo.episodeStr, latestEpisodeInfo.episodeNum,
        );
        const sendInfo = {
          email: '97world@gmail.com',
          monitorURL: pageURL,
          episodeStr: latestEpisodeInfo.episodeStr,
          episodeNum: latestEpisodeInfo.episodeNum,
          pageLink: util.parseRelativeURL(latestItemURL, pageURL),
          name: latestItemName,
        };
        await sendNotification(sendInfo);
      }
      task.latestItemURL = latestItemURL;
      task.episodeInfo = latestEpisodeInfo;
    } else {
      task.disabled = true;
      logger.warn('cannot find any result, URL = %s', pageURL);
    }

    await util.wait(2000);
  }

  logger.info('check task list finish, sleep 60s');
  await util.wait(60000);
  await monitor(taskList);
};

module.exports = monitor;