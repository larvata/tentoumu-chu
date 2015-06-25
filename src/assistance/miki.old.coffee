redisModule = require('redis')
phantom=require 'phantom'
_ = require 'underscore'
cheerio = require 'cheerio'
fs = require 'fs'
moment = require 'moment'

# schedule in memory sync with redis
schedule=[]

rooms=[]

redis={}
# For data provider and persist
class Miki
  constructor: (@config) ->


    # config init
    @assertConfig()

    # start redis client
    console.log "redis server: #{@config.redis_host}:#{@config.redis_port}"
    redis=redisModule.createClient(@config.redis_port,@config.redis_host)

  assertConfig:()->

    # manage page name
    @config.managePath ?= 'manage.html'

    # manage page auth token
    @config.token ?= 'token'

    # http server binding address:port
    @config.host ?= '127.0.0.1'
    @config.port ?= 3434

    # redis host
    @config.redis_host ?= '127.0.0.1'
    @config.redis_port ?= 6379

    # headless page path
    @config.headless ?= 'headless'

    # douyu api get room detail
    @config.douyuRoomAPI ?= "http://www.douyutv.com/api/client/room/"

    # douyu api get user avatar
    @config.douyuAvatarAPI ?= "http://uc.douyutv.com/avatar.php"

    # douyu api get screenshot
    @config.douyuWebPicUrl ?= "http://staticlive.douyutv.com/upload/web_pic"

    # zhanqi api get room detail
    @config.zhanqiRoomAPI ?= "http://www.zhanqi.tv/api/static/live.roomid/"

    # zhanqi api get user avatar
    @config.zhanqiAvatarAPI ?= "http://pic.cdn.zhanqi.tv/avatar"

    # zhanqi api get screenshot
    @config.zhanqiWebPicUrl ?= "http://dlpic.cdn.zhanqi.tv/live"

    # room check interval
    @config.roomCheckInterval ?= 120000

    # schedule fetch configuration [meru]
    @config.scheduleFetchRssUrl ?=
      "http://feedblog.ameba.jp/rss/ameblo/akb48tvinfo/rss20.xml"
    @config.scheduleTemplatesKey ?= "scheduleTemplates"
    @config.scheduleCheckInterval ?= 120000


    @config.apiVersions ?= {
      'v1':'v1'
    }

    @config.expireOffset ?= 0



    ###
      generate schedule pic
    ###
    @generaterTimer=undefined

    @generater=()=>
      headlessUrl="http://#{@config.host}:#{@config.port}/#{@config.headless}"
      phantom.create (ph)->
        ph.createPage (page)->

          page.open headlessUrl,(status)->
            page.render('static_content/schedule.png')
            console.log "Output on "+ new Date()
            ph.exit()

  generatePic:()->
    clearTimeout @generaterTimer
    @generaterTimer= setTimeout(@generater,5000)


  # v2.0
  # warmup service
  # load schedule from redis
  warmup:()->
    @loadSchedule()


  # replace old getSchedules()
  loadSchedule:()->
    schedule=[]
    redis.keys 'programme:*',(err,replies)->
      remains=replies.length

      replies.map (key)->
        redis.hgetall key,(err,replies)->
          schedule.push replies
          if --remains is 0
            console.log "[miki] finish load schedule"
            schedule=_.sortBy(schedule,'orderKey')

  getSchedule:()->
    return schedule


  getRooms:()->
    return rooms

  updateRoom:(room)->
    roomExisted=_.find(rooms,(r)->r.room_id is room.room_id)
    if roomExisted?
      roomExisted.show_status=room.show_status
      roomExisted.room_name=room.room_name
      roomExisted.show_time=room.show_time
    else
      rooms.push room

  createRequestOptions:(url,host)->
    headers=
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      'Accept-Encoding':'gzip, deflate, sdch'
      'Accept-Language':'en-US,en;q=0.8'
      'Cache-Control':'no-cache'
      'Connection':'keep-alive'
      'Host':host
      'Pragma':'no-cache'
      'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'

    options=
      url:url
      headers:headers
      gzip:true
      agent:false
      timeout:7000

    console.log "REQUEST: #{url}"

    return options

  # v2.0
  # formats: station-channel-id
  channels={
    'tbs':'TBS'
    'tbs-bs':'BS-TBS'
    'tbs-1':'TBSチャンネル1'

    'ntv':'日本テレビ'
    'ntv-bs':'BS日テレ'
    'ntv-plus':'日テレプラス'

    'nhk-variety':'NHK総合'
    'nhk-e-1':'NHK Eテレ1'
    'nhk-bs-perm':'NHK BSプレミアム'

    'asashi':'テレビ朝日'
    'asashi-bs':'BS朝日'

    'tokyo':'テレビ東京'
    'tokyo-mx-1':'TOKYO MX1'

    'fuji':'フジテレビ'

    'j-sports-3':'J SPORTS 3'

    'fami-geki':'ファミリー劇場'

    'chiba':'チバテレ'

    'green':'グリーンチャンネル'

    'lala':'LaLa TV'

  }

  # v2.0
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
      for k, v of channels
        if ret.channel is v
          ret.channelId = k
          channelFound=true
          break

      if !channelFound
        console.log "ChannelId Not Found: #{ret.channel}"
      return ret

    return ret



  # v2.0
  parseSchedule:(article)->
    $ = cheerio.load(article.description,{decodeEntities: false})
    text =  $.html().split('<br>')

    m=moment(article.pubdate)
    lastTemplate={
      year:m.year()
    }

    dayCount=0
    # schedule=[]
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

    return programmeList

  # v2.0
  # getProgrammeKey:(programme)->
  #   key="programme:"
  #   key+=programme.month
  #   key+=":"
  #   key+=programme.day
  #   key+=":"
  #   key+=programme.start
  #   key+=":"
  #   key+=programme.channelId
  #   return key


  # v2.0
  assertOrderKey:(programme)->
    orderKey=programme.year
    orderKey+=(if programme.month.length is 2 then programme.month else "0#{programme.month}")
    orderKey+=(if programme.day.length is 2 then programme.day else "0#{programme.day}")
    orderKey+=programme.start

    programme.orderKey=orderKey

  # v2.0
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

  # v2.0
  getExpireSeconds:(programme)->

    # delay seconds for key expire
    offset=@config.expireOffset

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

  # v2.0
  saveProgramme:(programme)->
    # key=@getProgrammeKey(programme)

    # cached=_.find schedule,(p)->
    #   p.key is programme.key

    countdown=@getExpireSeconds(programme)




    console.log "save key: #{programme.key}"

    redis.hmset programme.key,programme
    redis.expire programme.key,countdown
    # console.log "key: #{programme.key}"
    # console.log "countdown: #{countdown}"

  # v2.0
  # do not update programme which is already exists in schedule (by key)
  updateSchedule:(article)->
    parsedSchedule=@parseSchedule(article)
    # fs.writeFileSync './out.json',JSON.stringify(schedule,null,2)
    # console.log "schedule parse done"
    # console.log schedule


    # filter programme with existed key
    existedKeys=_.pluck schedule,'key'
    # console.log "existedKeys: #{existedKeys}"

    filteredSchedule=_.filter parsedSchedule,(p)->
      # console.log "filter:"
      # console.log "p.key: #{p.key}"
      ret = !_.contains existedKeys,p.key
      # console.log "#{ret}"
      return ret
    # # only for debug
    # filteredKeys=_.pluck filteredSchedule,'key'
    # console.log "filteredKeys: #{filteredKeys}"
    # console.log new Date()

    for p in filteredSchedule
      @saveProgramme(p)

    @loadSchedule()



module.exports = Miki

