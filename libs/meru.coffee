request = require 'request'

moment = require 'moment'

FeedParser = require 'feedparser'


class Tashima
    constructor: (@miki) ->

    startMonitor:()->
        miki=@miki

        url=miki.config.scheduleFetchRssUrl

        req=request(url)

        feedparser=new FeedParser()

        getTopArticle=()->
            article=@read()
            console.log item.title
            console.log '------'
            miki.updateSchedule(article)
            feedparser.removeListener 'readable',getTopArticle

        req.on 'response',(res)->
            if res.statusCode isnt 200
                return @emit('error',new Error('Bad status code'))
            @pipe(feedparser)

        feedparser.on 'readable',getTopArticle

        checker=(rss)->


            setTimeout checker,10000


module.exports = Tashima
