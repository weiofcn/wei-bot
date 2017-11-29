const request = require('superagent');
const cheerio = require('cheerio');
const url = require('url');

async function fetchTitleAndUrl(page) {
  if ((typeof(page) === 'undefined') || page <= 0) page = 1;

  let newsFeed = []
  let res = await request.get(('https://news.cnblogs.com/n/page/' + page || '1'));

  const $ = cheerio.load(res.text);

  // parse title and url
  $('#news_list .news_entry').each(function(idx, element) {
    const $element = $(element);
    let href = url.resolve('https://news.cnblogs.com/', $element.find('a').attr('href'));
    let title = $element.find('a').text();
    newsFeed.push({
      title: title,
      href: href
    });
  });

  // parse summary
  $('#news_list .entry_summary').each(function(idx, element) {
    const $element = $(element);
    let summary = $element.text().trim();
  });

  // parse publish date
  $('#news_list .entry_footer').each(function(idx, element) {
    const $element = $(element);
    let date = $element.children().last().text();
  });

  //console.log(newsFeed);
  return newsFeed;
}

module.exports = {
  fetchTitleAndUrl
}