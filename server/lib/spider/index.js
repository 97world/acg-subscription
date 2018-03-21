const url = require('url');
const cheerio = require('cheerio');
const request = require('superagent');

const log = require('../../common/log');
const util = require('../../common/util');
const Topic = require('../../model/topic');

const logger = log.loggers.get('spider');

function resolveSingleItemDOM($item, spiderURL) {
  const name = $item.find('.title>a').text().trim();
  const episodeInfo = util.getEpisodeInfo(name);
  return {
    name,
    type: util.getEpisodeType(name),
    subTitleTeam: $item.find('.title>span').first().text().trim(),
    magnetURL: $item.find('.download-arrow.arrow-magnet').attr('href'),
    publishAt: $item.children('td').find('span').first().text().trim(),
    category: $item.find('.sort-2').text().trim(),
    size: $item.children('td').eq(4).text().trim(),
    seeding: $item.children('td').eq(5).text().trim(),
    downloading: $item.children('td').eq(6).text().trim(),
    downloaded: $item.children('td').eq(7).text().trim(),
    episodeStr: episodeInfo.episodeStr,
    episodeNum: episodeInfo.episodeNum,
    pageURL: util.parseRelativeURL($item.find('.title>a').attr('href'), spiderURL),
  };
};

function getNextBtn($) {
  return $('#topic_list').siblings('.nav_title').children('a');
};

async function spider(spiderURL) {
  const startAt = new Date().getTime();
  const response = await request.get(spiderURL);
  const endAt = new Date().getTime();
  const html = response.text;
  const $ = cheerio.load(html);

  logger.info('crawling URL: %s [%dms]', spiderURL, endAt - startAt);

  const list = $('#topic_list tbody>tr');
  list.each(index => {
    const $item = list.eq(index);
    const data = resolveSingleItemDOM($item, spiderURL);
    const topic = new Topic({
      name: 'test'
    });
    topic.save();
  });

  let btn4NextPage = getNextBtn($);
  if (btn4NextPage.length) {
    btn4NextPage = btn4NextPage.last();
    if (btn4NextPage.text() === '下一頁') {
      let nextPageURL = util.parseRelativeURL(btn4NextPage.attr('href'), spiderURL);
      await util.wait(2000);
      await spider(nextPageURL);
    } else {
      logger.info('crawl finish!');
    }
  }
};

module.exports = spider;