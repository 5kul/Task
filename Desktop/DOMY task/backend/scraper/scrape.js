const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

async function scrape(){
  const res = await axios.get('https://news.ycombinator.com/');
  const $ = cheerio.load(res.data);
  const stories = [];
  $('tr.athing').slice(0, 10).each((i, el) => {
    const title = $(el).find('.titleline a').text().trim();
    const url = $(el).find('.titleline a').attr('href');
    const sub = $(el).next();
    const points = parseInt(sub.find('.score').text()) || 0;
    const author = sub.find('.hnuser').text() || '';
    const postedAt = sub.find('.age').text() || '';
    stories.push({ title, url, points, author, postedAt });
  });

  // Upsert into DB
  for (const s of stories) {
    if (!s.url) continue;
    await Story.findOneAndUpdate({ url: s.url }, s, { upsert: true, setDefaultsOnInsert: true });
  }
}

module.exports = scrape;
