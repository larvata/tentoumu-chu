// Generated by CoffeeScript 1.9.1
var FeedParser, Tashima, moment, request;

request = require('request');

moment = require('moment');

FeedParser = require('feedparser');

Tashima = (function() {
  function Tashima(miki1) {
    this.miki = miki1;
  }

  Tashima.prototype.startMonitor = function() {
    var checker, feedparser, getTopArticle, miki, req, url;
    miki = this.miki;
    url = miki.config.scheduleFetchRssUrl;
    req = request(url);
    feedparser = new FeedParser();
    getTopArticle = function() {
      var article;
      article = this.read();
      console.log(item.title);
      console.log('------');
      miki.updateSchedule(article);
      return feedparser.removeListener('readable', getTopArticle);
    };
    req.on('response', function(res) {
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
      }
      return this.pipe(feedparser);
    });
    feedparser.on('readable', getTopArticle);
    return checker = function(rss) {
      return setTimeout(checker, 10000);
    };
  };

  return Tashima;

})();

module.exports = Tashima;
