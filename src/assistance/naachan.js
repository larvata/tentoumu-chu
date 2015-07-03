import request from 'request';
// import fs from 'fs';
import moment from 'moment';

// var roomsData=[];

class Room{
  constructor(roomInfo,url){
    this.url=url;

    this.show_status=0;
    this.show_status=0;
    this.room_name='';
    this.show_time=0;
    this.live_snapshot='';
    this.owner_avatar='';
    this.show_details='';
    this.fans=0;
    this.online=0;
    this.room_url='';

    this.room_id = roomInfo.room_id;
    this.always_show = roomInfo.always_show;
    this.disabled = roomInfo.disabled;
    this.live_provider = roomInfo.live_provider;

  }

  getDuration(){
    var timestamp=parseInt(this.show_time);
    return moment.unix(timestamp).locale('zh-cn').fromNow(true);
  }
}
 
var parseDouyuRoomInfo=(jsonText,room)=>{
  try{
    var obj=JSON.parse(jsonText).data;

    room.show_status=parseInt(obj.show_status);
    room.room_name=obj.room_name;
    room.show_time=obj.show_time;
    room.live_snapshot=obj.room_src;
    room.owner_avatar=obj.owner_avatar;
    room.show_details=obj.show_details;
    room.fans=parseInt(obj.fans);
    room.online=obj.online;
    room.room_url=obj.url;
  }
  catch(e){
    console.log("ERROR: parse room info");
    console.log(room.url);
    console.log(jsonText);
    console.log("------------------");
  }

};

var parseZhanqiRoomInfo=(jsonText,room)=>{
  try{
    var obj = JSON.parse(jsonText).data;

    room.show_status=parseInt(obj.status);
    if (room.show_status === 0){
      room.show_status=2;
    }
    else{
      room.show_status=1;
    }

    room.room_name = obj.title;
    room.show_time=obj.liveTime;
    room.live_snapshot=obj.bpic;
    room.owner_avatar=obj.avatar;
    room.fans=obj.follows;
    room.online=parseInt(obj.online);
    room.room_url=obj.url;
  }
  catch(e){
    console.log("ERROR: parse room info");
    console.log(room.url);
    console.log(jsonText);
    console.log("------------------");
  }
};


class Okada{
  constructor(miki){
    this.miki=miki;
  }

  startMonitor(){

    var checker=(room)=>{
      var hostname='';
      switch(room.live_provider){
        case 'douyu':
          hostname='www.douyutv.com';
          break;
        case 'zhanqi':
          hostname='www.zhanqi.tv';
          break;
      }

      var options=this.miki.createRequestOptions(room.url,hostname);

      request(options,(err,res,body)=>{
        if (err) {
          console.log(room.url);
          console.log(err);
        }

        switch(room.live_provider){
          case 'douyu':
            parseDouyuRoomInfo(body,room);
            if (room.live_snapshot) {
              room.live_snapshot = room.live_snapshot.replace(this.miki.config.douyuWebPicUrl,'');
              room.owner_avatar = room.owner_avatar.replace(this.miki.confi.douyuAvatarAPI,'\/');
              this.miki.updateRoom(room);
            }
            else{
              console.log("douyu live_snapshot empty, dont save");
              console.log(JSON.stringify(room));
            }
            break;
          case 'zhanqi':
            parseZhanqiRoomInfo(body,room);
            room.live_snapshot = room.live_snapshot.replace(this.miki.config.zhanqiWebPicUrl,'');
            room.owner_avatar = room.owner_avatar.replace(this.miki.config.zhanqiAvatarAPI,'');
            this.miki.updateRoom(room);
            break;
          default:
            console.error("ERROR: cant parse live_provider");
        }

        setTimeout((function(){
          return ()=>checker(room);
        })(),this.miki.config.roomCheckInterval);


      });

    };

    for(var r of this.miki.config.roomInfo){
      if (r.disabled) {continue;}

      var url='';
      switch(r.live_provider){
        case "douyu":
          url = this.miki.config.douyuRoomAPI+r.room_id;
          break;
        case "zhanqi":
          url = this.miki.config.zhanqiRoomAPI+r.room_id+".json";
          break;
      }
      var room = new Room(r,url);
      checker(room);
    }
  }
}

export default Okada;

