
import CSON from 'season';
import userConfig from '../configs/tentoumu-chu';




class Miki{
  constructor(){
    this.assignConfigs();

    this.ScheduleData={};
  }

  // todo
  updateRoomInfo(roomInfo){

  }

  // todo
  getRoomInfo(){

  }

  updateSchedule(schedule){
    console.log("miki: updateSchedule");
    this.ScheduleData=schedule;
  }

  getSchedule(){
    return this.ScheduleData;
  }

  // todo
  // onScheduleChanged(cb){}
  // onRoomInfoChanged(cb){}

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

    console.log(this.config);
  }
}

export default new Miki();
