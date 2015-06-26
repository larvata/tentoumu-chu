request = require 'request'
_ = require 'underscore'
moment = require 'moment'
cheerio = require 'cheerio'
FeedParser = require 'feedparser'
redisModule = require('redis')


# todo prevent save programme expired
class Tashima
  constructor: (@miki) ->
    @redis=redisModule.createClient(@miki.config.redis_port,@miki.config.redis_host)
    # schedule in memory sync with redis
    @schedule=[]

    # warmup
    @loadSchedule()

  # formats: station-channel-id
  channels: {
    'tbs':'TBS'
    'tbs-bs':'BS-TBS'
    'tbs-1':'TBSチャンネル1'

    'ntv':'日本テレビ'
    'ntv-bs':'BS日テレ'
    'ntv-plus':'日テレプラス'

    'nhk-variety':'NHK総合'
    'nhk-e-1':'NHK Eテレ1'
    'nhk-bs-perm':'NHK BSプレミアム'
    'nhk-edu':'NHK Eテレ'

    'asashi':'テレビ朝日'
    'asashi-bs':'BS朝日'

    'tokyo':'テレビ東京'
    'tokyo-mx-1':'TOKYO MX1'

    'fuji':'フジテレビ'
    'fuji-one':'フジテレビONE'

    'j-sports-3':'J SPORTS 3'

    'fami-geki':'ファミリー劇場'

    'chiba':'チバテレ'

    'green':'グリーンチャンネル'

    'lala':'LaLa TV'

    'wowow-prime':'WOWOWプライム'

    'musicontv':'MUSIC ON! TV'

    'tvk':'tvk'
  }

  parseSchedule:(article)->
    $ = cheerio.load(article.description,{decodeEntities: false})
    text =  $.html().split('<br>')

    m=moment(article.pubdate)
    lastTemplate={
      year:m.year()
    }

    dayCount=0
    programmeList=[]
    for t in text
      break if dayCount is 3
      ret=@parseProgramme(t,lastTemplate)
      if ret.type is 'date'
        dayCount++
        lastTemplate=ret
      else if ret.type is 'programme'
        @assertOrderKey(ret)
        @assertProgrammeKey(ret)
        programmeList.push ret

    # return programmeList
    # filter programme with existed key
    existedKeys=_.pluck @schedule,'key'

    filteredSchedule=_.filter programmeList,(p)->
      ret = !_.contains existedKeys,p.key
      return ret

    for p in filteredSchedule
      @saveProgramme(p)

    @loadSchedule()


  parseProgramme:(text,template)->
    ret={
      type:'unknow'
      year:template.year
      month:-1
      day:-1
      start:''
      end:''
      channel:''
      channelId:''
      title:''
      episode:''
      members:''
      orderKey:''

      # format: provider_roomId(e.g. zhanqi_33968)
      roomId:''
      roomTitle:''
    }

    match=text.match(/(\d+)月(\d+)日（\S）/)
    if match?
      ret.type='date'
      ret.month=match[1]
      ret.day=match[2]
      return ret

    match=text.match(/(\S+)～(\S+)\s(.*)\s『(.*)』(\s#\d+)?(\s.*)?/)
    if match?
      ret.month=template.month
      ret.day=template.day
      ret.type='programme'
      ret.start=match[1]
      ret.end=match[2]
      ret.channel=match[3]
      ret.title=match[4]
      ret.episode=(match[5]||'').trim()
      ret.members=(match[6]||'').trim()

      channelFound=false
      for k, v of @channels
        if ret.channel is v
          ret.channelId = k
          channelFound=true
          break

      if !channelFound
        console.log "ChannelId Not Found: #{ret.channel}"
      return ret

    return ret

  assertOrderKey:(programme)->
    orderKey=programme.year
    orderKey+=(if programme.month.length is 2 then programme.month else "0#{programme.month}")
    orderKey+=(if programme.day.length is 2 then programme.day else "0#{programme.day}")
    orderKey+=programme.start

    programme.orderKey=orderKey

  assertProgrammeKey:(programme)->
    key="programme:"
    key+=programme.month
    key+=":"
    key+=programme.day
    key+=":"
    key+=programme.start
    key+=":"
    key+=programme.channelId

    programme.key=key

  getExpireSeconds:(programme)->
    # delay seconds for key expire
    offset=@miki.config.expireOffset

    timeParts=programme.end.split(':')
    hour = timeParts[0]
    minute = timeParts[1]

    if hour>=24
      hourOverflow=true
      hour-=24
    else
      hourOverflow=false

    timeString="#{programme.year} #{programme.month} #{programme.day} #{hour} #{minute} +0900"
    # console.log "source* #{timeString}"

    endMoment=moment(timeString,'YYYY MM DD HH mm Z')
    endMoment.add(1,'day') if hourOverflow

    # console.log "end* " + endMoment.format('YYYY M D H m Z')
    currentMoment=moment()

    # console.log "now* " + currentMoment.format('YYYY M D H m Z')
    countdown=endMoment.diff(currentMoment,'second')+offset

    return countdown

  # save programme to db
  saveProgramme:(programme)->
    countdown=@getExpireSeconds(programme)
    console.log "save key: #{programme.key}"

    @redis.hmset programme.key,programme
    @redis.expire programme.key,countdown

  loadSchedule:()->
    @schedule=[]
    self=@
    @redis.keys 'programme:*',(err,replies)->
      remains=replies.length

      replies.map (key)->
        self.redis.hgetall key,(err,replies)->
          self.schedule.push replies
          if --remains is 0
            # all done
            console.log "[miki] finish load schedule, saving..."
            self.schedule=_.sortBy(self.schedule,'orderKey')
            self.miki.updateSchedule(self.schedule)




  startService:()->
    self=@
    # miki=@miki

    url=self.miki.config.scheduleFetchRssUrl

    req=request(url)

    feedparser=new FeedParser()

    getTopArticle=()->
      article=@read()
      console.log "parsing date: #{article.title}"
      feedparser.removeListener 'readable',getTopArticle

      self.parseSchedule(article)

      # miki.updateSchedule(article)


    req.on 'response',(res)->
      if res.statusCode isnt 200
        return @emit('error',new Error('Bad status code'))
      @pipe(feedparser)

    feedparser.on 'readable',getTopArticle

    checker=(rss)->
      setTimeout checker,@miki.config.scheduleCheckInterval


module.exports = Tashima
