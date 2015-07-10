// import CSON from 'season';
import userConfig from '../configs/tentoumu-chu';
import _ from 'underscore';



class Miki{
  constructor(){
    this.assignConfigs();

    this.ScheduleData={};

    this.roomInfoes=[];

    this.handlerProgrammeChanged=null;
    this.handlerRoomInfoChanged=null;

  }

  // todo move update to naachan
  updateRoomInfo(roomInfo){
    console.log("in updateRoomInfo");
    // console.log(roomInfo);

    var roomExisted = _.find(this.roomInfoes,r=>{
      return (r.room_id === roomInfo.room_id);
    });

    if (roomExisted !== undefined){
      Object.assign(roomExisted,roomInfo);
    }
    else{
      this.roomInfoes.push(roomInfo);
    }
  }

  // todo
  getRoomInfoes(){
    return this.roomInfoes;
  }

  // update schedule list , ONLY call by meru
  updateSchedule(schedule){
    console.log("miki: updateSchedule");
    this.ScheduleData=schedule;
  }

  updateProgramme(programme){
    // console.log("miki: update programme");
    // var found=_.find(this.scheduleData,p=>{
    //   return programme.key === p.key;
    // });
    // console.log(found);
    // Object.assign(found,programme);

    // return found;
    console.log("miki: updateProgramme");
    this.handlerProgrammeChanged(programme);
  }

  getSchedule(){
    return this.ScheduleData;
  }

  getRoomMeta(){

    var ret = _.chain(this.config.roomMeta).filter(r=>{
      return !r.disabled && r.assignable;
    }).map(r=>{
      r.key=`${r.live_provider}_${r.room_id}`;
      return r;
    }).value();
    return ret;
  }

  // register event callback 
  onProgrammeChanged(cb){
    this.handlerProgrammeChanged=cb;
  }
  onRoomInfoChanged(cb){
    this.handlerRoomInfoChanged=cb;
  }

  assignConfigs(){
    this.config={
      // http server binding address:port
      host: '127.0.0.1',
      port: 3434,

      // redis host
      redis_host: '127.0.0.1',
      redis_port: 6379,

      // douyu api get room detail
      douyuRoomAPI: "http://www.douyutv.com/api/client/room/",

      // douyu api get user avatar
      douyuAvatarAPI: "http://uc.douyutv.com/avatar.php",

      // douyu api get screenshot
      douyuWebPicUrl: "http://staticlive.douyutv.com/upload/web_pic",

      // zhanqi api get room detail
      zhanqiRoomAPI: "http://www.zhanqi.tv/api/static/live.roomid/",

      // zhanqi api get user avatar
      zhanqiAvatarAPI: "http://pic.cdn.zhanqi.tv/avatar",

      // zhanqi api get screenshot
      zhanqiWebPicUrl: "http://dlpic.cdn.zhanqi.tv/live",

      // room check interval
      roomCheckInterval: 120000,

      // schedule fetch configuration [meru]
      scheduleFetchRssUrl: "http://feedblog.ameba.jp/rss/ameblo/akb48tvinfo/rss20.xml",
      scheduleTemplatesKey: "scheduleTemplates",
      scheduleCheckInterval: 120000,

      apiVersions: {
        'v1':'v1'
      },

      expireOffset: 0
    };

    Object.assign(this.config,userConfig);

  }
}

export default new Miki();
