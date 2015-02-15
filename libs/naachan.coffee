request = require 'request'
fs = require 'fs'

moment = require 'moment'

roomsData=[]

class Room
  constructor: (@room_id,@show_status,@room_name,
    @show_time,@room_src,@url,@owner_uid,
    @show_details,@fans)->

  duration:()->
    timestamp=parseInt(@show_time)
    return moment.unix(timestamp).locale('zh-cn').fromNow(true)

class Okada
  constructor: (@miki) ->

  startMonitor: ()->
    miki=@miki

    checker=(room)->
      request room.url,(err,res,body)->

        try
          obj=JSON.parse(body).data

          room.show_status=parseInt(obj.show_status)
          room.room_name=obj.room_name
          room.show_time=obj.show_time
          room.room_src=obj.room_src
          room.owner_uid=obj.owner_uid
          room.show_details=obj.show_details
          room.fans=obj.fans

          miki.updateRoom(room)

        catch e
          console.log body
          console.log "------------"

        setTimeout do->
          ()->
            checker(room)
        ,miki.config.roomCheckInterval


    for i in @miki.config.roomIds
      url=@miki.config.douyuRoomAPI+i
      room=new Room(i,0,'',0,'',url,'','',0)

      checker(room)

module.exports = Okada

