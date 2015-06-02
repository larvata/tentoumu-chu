request = require 'request'
moment = require 'moment'
FeedParser = require 'feedparser'


class Tashima
  constructor: (@miki) ->

  startMonitor:()->
    miki=@miki
    url=miki.config.scheduleFetchRssUrl
    checker=()->
      console.log "[meru] start checker"

      req=request(url)
      feedparser=new FeedParser()

      getTopArticle=()->
        article=@read()
        feedparser.removeListener 'readable',getTopArticle
        miki.updateSchedule(article)

        console.log "[meru] feed loaded, schedule a new checker"
        setTimeout checker,miki.config.scheduleCheckInterval


      req.on 'response',(res)->
        if res.statusCode isnt 200
          return @emit('error',new Error('Bad status code'))
        @pipe(feedparser)

      feedparser.on 'readable',getTopArticle



    checker()


module.exports = Tashima
