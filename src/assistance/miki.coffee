CSON = require 'season'


class Miki
  constructor: () ->
    @assertConfig()

    @ScheduleData={}

  updateRoomInfo:(roomInfo)->

  getRoomInfo:()->



  updateSchedule:(schedule)->
    console.log "miki: updateSchedule"
    @ScheduleData=schedule
    # console.log schedule
    # console.log @context

    # @context.executeAction


  getSchedule:()->
    return @ScheduleData

  # todo
  # onScheduleChanged:(cb)->
  # onRoomInfoChanged:(cb)->


  assertConfig:()->
    @config = CSON.readFileSync("#{__dirname}/../configs/tentoumu-chu.cson")

    # http server binding address:port
    @config.host ?= '127.0.0.1'
    @config.port ?= 3434

    # redis host
    @config.redis_host ?= '127.0.0.1'
    @config.redis_port ?= 6379

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


module.exports = new Miki()
