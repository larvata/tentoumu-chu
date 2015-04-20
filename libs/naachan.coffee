request = require 'request'
fs = require 'fs'

moment = require 'moment'

roomsData=[]

class Room
  constructor: (roomInfo,@url)->
    @show_status=0
    @room_name=''
    @show_time=0
    @live_snapshot=''
    @owner_avatar=''
    @show_details=''
    @fans=0
    @online=0
    @room_url=''
    {@room_id,@always_show,@disabled,@live_provider}=roomInfo



  duration:()->
    timestamp=parseInt(@show_time)
    return moment.unix(timestamp).locale('zh-cn').fromNow(true)

parseDouyuRoomInfo=(jsonText,room)->
  try
    obj=JSON.parse(jsonText).data

    room.show_status=parseInt(obj.show_status)
    room.room_name=obj.room_name
    room.show_time=obj.show_time
    room.live_snapshot=obj.room_src
    room.owner_avatar=obj.owner_avatar
    room.show_details=obj.show_details
    room.fans=parseInt(obj.fans)
    room.online=obj.online
    room.room_url=obj.url



  catch e
    console.log "ERROR: parse room info"
    console.log room.url
    console.log jsonText
    console.log "------------"

parseZhanqiRoomInfo=(jsonText,room)->
  try
    obj = JSON.parse(jsonText).data

    room.show_status=parseInt(obj.status)
    if room.show_status isnt 2
      room.show_status=1

    room.room_name = obj.title
    room.show_time=obj.liveTime
    room.live_snapshot=obj.bpic
    room.owner_avatar=obj.avatar
    room.fans=obj.follows
    room.online=parseInt(obj.online)
    room.room_url=obj.url


  catch e
    console.log "ERROR: parse room info"
    console.log room.url
    console.log jsonText
    console.log  "------------"


class Okada
  constructor: (@miki) ->

  startMonitor: ()->
    miki=@miki

    checker=(room)->
      switch room.live_provider
        when 'douyu'
          hostname='www.douyutv.com'
        when 'zhanqi'
          hostname='www.zhanqi.tv'
      options=miki.createRequestOptions(room.url,hostname)
      # console.log "rurl:#{room.url}"
      request options,(err,res,body)->
        if err?
          console.log room.url
          console.log err

        switch room.live_provider
          when "douyu"
            parseDouyuRoomInfo(body,room)
            room.live_snapshot=room.live_snapshot.replace(miki.config.douyuWebPicUrl,'')
            # console.log room
            room.owner_avatar=room.owner_avatar.replace(miki.config.douyuAvatarAPI,'\/')
            miki.updateRoom(room)
          when "zhanqi"
            parseZhanqiRoomInfo(body,room)
            room.live_snapshot=room.live_snapshot.replace(miki.config.zhanqiWebPicUrl,'')
            # console.log room
            room.owner_avatar=room.owner_avatar.replace(miki.config.zhanqiAvatarAPI,'')
            miki.updateRoom(room)
          else
            console.error "ERROR: cant parse live_provider"

        # console.log JSON.stringify(room,null,2)
        setTimeout do->
          ()->
            checker(room)
        ,miki.config.roomCheckInterval


    for r in @miki.config.roomInfo
      continue if r.disabled

      switch r.live_provider
        when "douyu"
          url=@miki.config.douyuRoomAPI+r.room_id
        when "zhanqi"
          url=@miki.config.zhanqiRoomAPI+r.room_id+".json"
      room=new Room(r,url)
      checker(room)

module.exports = Okada

