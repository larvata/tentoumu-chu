redisModule = require('redis')
phantom=require 'phantom'
_ = require 'underscore'

schedules=[]
rooms=[]

redis={}
# For data provider and persist
class Miki
  constructor: (@config) ->

    # start redis client
    console.log "redis server: #{@config.redis_host}:#{@config.redis_port}"
    redis=redisModule.createClient(@config.redis_port,@config.redis_host)

    # load schedules from redis
    redis.lrange [@config.scheduleKey,0,-1],(err,replies)->
      for r in replies
        s= JSON.parse(r)
        schedules.push s

    @generaterTimer=undefined

    @generater=()=>
      headlessUrl="http://#{@config.host}:#{@config.port}/#{@config.headless}"
      phantom.create (ph)->
        ph.createPage (page)->

          page.open headlessUrl,(status)->
            page.render('static_content/schedule.png')
            console.log "Output on "+ new Date()
            ph.exit()

  getSchedules:()->
    return schedules


  setSchedule:(schedule)->
    found=false
    for i in [0...schedules.length]
      s=schedules[i]
      if s.order is schedule.order
        s.begin=schedule.begin
        s.end=schedule.end
        s.description=schedule.description

        found=true
        break

    schedules.push schedule if !found

    ret=[]
    redis.del @config.scheduleKey
    for i in [0...schedules.length]
      s=schedules[i]

      if s.begin.length is 0 and s.end.length is 0 and s.description.length is 0
      else
        s.order=i+1
        ret.push s

        # save to redis
        redis.rpush @config.scheduleKey,JSON.stringify(s)

    # trim and set list dirty
    redis.ltrim @config.scheduleKey,0,ret.length-1
    schedules=ret

    @generatePic()

    return schedules

  generatePic:()->
    clearTimeout @generaterTimer
    @generaterTimer= setTimeout(@generater,5000)

  getRooms:()->
    return rooms

  updateRoom:(room)->
    # if _.any(rooms,(r)->r.room_id is room.room_id)
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



    console.log "REQUEST: #{url}"

    return options

module.exports = Miki

