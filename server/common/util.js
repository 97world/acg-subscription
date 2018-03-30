const nodemailer = require('nodemailer');
const url = require('url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const log = require('common/log');
const config = require('common/config');

const logger = log.loggers.get('server');

function wait(millisecond) {
  function setTimeoutPromisify(millisecond) {
    return new Promise(resolve => setTimeout(resolve, millisecond));
  };
  return setTimeoutPromisify(millisecond);
};

/**
 * determine the type based on the name
 *
 * @param      {string}  name    topic name
 * @return     {Number}  return type number (1: 动漫, 2: 剧场版, 3: 特别篇, 4: 全集, 5: 漫画, 6: 游戏, 7: 音乐, 0: 其它)
 */
function getEpisodeType(name) {
  let result = 1;
  if (/(剧场|劇場)/.test(name)) {
    result = 2;
  } else if (/(特别篇|特別篇)/.test(name)) {
    result = 3;
  } else if (/(全集|全集)/.test(name)) {
    result = 4;
  }
  return result;
  // if (/(漫画|漫畫)/.test(name)) {
  // } else if (/(游戏|遊戲)/.test(name)) {
  // } else if (/(音乐|音樂|mp3)/i.test(name)) {
  // } else if (/(全集|全集)/.test(name)) {
  // }
};

function getEpisodeInfo(name) {
  let matchResult = name.match(/[\[\u4E00-\u9FA5]\d+([\.-]\d+)?[\]\u4E00-\u9FA5]/g);
  let episodeStr = null;
  let episodeNum = null;
  if (!matchResult || matchResult.length === 0) {
    logger.warn('unable to parse episode, name = %s', name);
  } else {
    episodeStr = matchResult[0];
    if (matchResult.length > 1) {
      logger.warn(
        'multiple results were found for parsing episode, name = %s, matchResult = %s',
        name, matchResult.join(','),
      );
    }
  }
  if (episodeStr) {
    episodeStr = episodeStr.match(/\d+/g);
    if (episodeStr.length > 1) {
      episodeStr = episodeStr.map(episode => parseInt(episode)).join('-');
      episodeNum = parseInt(episodeStr.split('-')[0]);
      logger.warn(
        'multiple episodes were found, name = %s, episodeStr = %s, episodeNum = %d',
        name, episodeStr, episodeNum,
      );
    } else {
      episodeNum = parseInt(episodeStr[0]);
    }
  }
  return {
    episodeStr,
    episodeNum,
  };
};

function parseRelativeURL(relativeURL, currentPageURL) {
  const currentPageURLParsed = url.parse(currentPageURL);
  const protocol = currentPageURLParsed.protocol;
  const host = currentPageURLParsed.host;
  const pathname = currentPageURLParsed.pathname;
  return url.resolve(protocol + '//' + host + pathname, relativeURL);
};

async function sendMail(option) {
  const user = config.mail.user;
  const pass = config.mail.pass;
  const mailTransport = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.host,
    secureConnection: config.mail.secureConnection,
    auth: { user, pass },
  });
  option.from = user;
  const sendResult = await mailTransport.sendMail(option);
  logger.info('send notification to %s success, sendResult = %s',
                sendInfo.email, JSON.stringify(sendResult));
};

function encryptPassword(password) {
  const md5 = crypto.createHash('md5');
  md5.update(password);
  return md5.digest('hex');
};

function jwtVerify(token) {
  return jwt.verify(token, config.token.secret);
};

function jwtSign(payload) {
  return jwt.sign(payload, config.token.secret, {
    expiresIn: config.token.expiresIn,
  });
};

module.exports = {
  wait,
  getEpisodeType,
  getEpisodeInfo,
  parseRelativeURL,
  sendMail,
  encryptPassword,
  jwtVerify,
  jwtSign,
};