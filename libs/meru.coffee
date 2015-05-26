request = require 'request'

moment = require 'moment'

FeedParser = require 'feedparser'


class Tashima
    constructor: (@miki) ->

    startMonitor:()->
        miki=@miki

        url=miki.config.scheduleFetchRssUrl

        req=request(url)

        feedparser=new FeedParser();
        req.on 'response',(res)->
            if res.statusCode isnt 200
                return @emit('error',new Error('Bad status code'))
            @pipe(feedparser)

        feedparser.on 'readable',()->
            while item=@read()
                console.log item
                console.log '------'
                break

        checker=(rss)->
            

            setTimeout checker,10000

    
module.exports = Tashima