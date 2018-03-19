const url = require('url');
const cheerio = require('cheerio');
const request = require('superagent');

const log = require('../../common/log');
const util = require('../../common/util');
const Topic = require('../../model/topic');

const logger = log.loggers.get('spider');

async function spider(spiderURL) {
  logger.info('crawling URL: %s', spiderURL);

  const response = await request.get(spiderURL);
  const html = response.text;
  const $ = cheerio.load(html);

  const list = $('#topic_list tbody>tr');
  list.each(index => {
    const item = list.eq(index);
    const name = item.find('.title>a').text().trim();
    const type = util.getEpisodeType(name);
    const subTitleTeam = item.find('.title>span').first().text().trim();
    const magnetURL = item.find('.download-arrow.arrow-magnet').attr('href');
    const publishAt = item.children('td').find('span').first().text().trim();
    const category = item.find('.sort-2').text().trim();
    const size = item.children('td').eq(4).text().trim();
    const seeding = item.children('td').eq(5).text().trim();
    const downloading = item.children('td').eq(6).text().trim();
    const downloaded = item.children('td').eq(7).text().trim();
    const episodeInfo = util.getEpisodeInfo(name);
    const episodeStr = episodeInfo.episodeStr;
    const episodeNum = episodeInfo.episodeNum;
    const pageURL = util.parseRelativeURL(item.find('.title>a').attr('href'), spiderURL);

    const topic = new Topic({
      name,
      type,
      category,
      subTitleTeam,
      episodeStr,
      episodeNum,
      magnetURL,
      size,
      seeding,
      downloading,
      downloaded,
      pageURL,
      publishAt,
    });
    topic.save();
  });

  let btn4NextPage = $('#topic_list').siblings('.nav_title').children('a');
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