import request from 'request';
import _ from 'underscore';
import moment from 'moment';
import cheerio from 'cheerio';
import FeedParser from 'feedparser';
import redisModule from 'redis';


var channels = {
  'tbs':'TBS',
  'tbs-bs':'BS-TBS',
  'tbs-1':'TBSチャンネル1',

  'ntv':'日本テレビ',
  'ntv-bs':'BS日テレ',
  'ntv-plus':'日テレプラス',

  'nhk-variety':'NHK総合',
  'nhk-edu-1':'NHK Eテレ1',
  'nhk-bs-1':'NHK BS1',
  'nhk-bs-perm':'NHK BSプレミアム',
  'nhk-edu':'NHK Eテレ',

  'asashi':'テレビ朝日',
  'asashi-bs':'BS朝日',

  'tokyo':'テレビ東京',
  'tokyo-mx-1':'TOKYO MX1',

  'fuji':'フジテレビ',
  'fuji-one':'フジテレビONE',
  'fuji-next':'フジテレビNEXT',

  'j-sports-3':'J SPORTS 3',

  'fami-geki':'ファミリー劇場',

  'chiba':'チバテレ',

  'green':'グリーンチャンネル',

  'lala':'LaLa TV',

  'wowow-prime':'WOWOWプライム',
  'wowow-live':'WOWOWライブ',
  'wowow-cinema':'WOWOWシネマ',

  'musicontv':'MUSIC ON! TV',

  'tvk':'tvk',

  'dhc':'DHCシアター',

  'sp-4k':'スカパー!4K',

  'space-shower':'スペースシャワーTV',

  'bs-japan':'BSジャパン'


};


// todo prevent save expired programme 
class Tashima{
  constructor(miki){
    this.miki = miki;

    this.redis = redisModule.createClient(
      this.miki.config.redis_port,
      this.miki.config.redis_host);


    this.schedule=[];

    //warmup
    this.loadSchedule();


    // register callback
    // update programme by key
    this.miki.onProgrammeChanged((programme,callback)=>{
      
      var found=_.find(this.schedule,p=>{
        return programme.key === p.key;
      });

      
      Object.assign(found,programme);

      this.saveProgramme(found);
      this.loadSchedule(callback);


      // callback(null,this.miki.getSchedule());

    });


    this.miki.onProgrammeAdded((programme,callback)=>{

      var found=_.find(this.schedule,p=>{
        return programme.key === p.key;
      });

      if (found !== undefined) {
        console.log("duplicated key,programme already added.");
        return;
      }

      this.saveProgramme(programme);
      this.loadSchedule(callback);

      // console.log("try start callback onProgrammeChanged");
      // callback(null,this.miki.getSchedule());

    });

    this.miki.onProgrammeDeleted((programme,callback)=>{

      var found = _.find(this.schedule, p=>{
        return programme.key === p.key;
      });

      if (found === undefined) {
        console.log("not found programme to be deleted");
        return;
      }

      // set expired year, 
      // redis will remove this record automatically
      programme.year=2012;
      this.saveProgramme(programme);
      this.loadSchedule(callback);

      

    });


  }

  parseSchedule(article){
    var $ = cheerio.load(article.description,{decodeEntities: false});
    var text =  $.html().split('<br>');

    var m=moment(article.pubdate);
    var lastTemplate={
      year:m.year()
    };

    var dayCount=0;
    var programmeList=[];

    for(var t of text){
      if (dayCount === 3) {
        break;
      }

      var ret = this.parseProgramme(t,lastTemplate);
      if (ret.type === 'date') {
        dayCount++;
        lastTemplate = ret;
      }
      else if (ret.type === 'programme-auto'){
        this.assertOrderKey(ret);
        this.assertProgrammeKey(ret);
        programmeList.push(ret);
      }
    }

    //filter programme with existed key
    var existedKeys = _.pluck(this.schedule, 'key');

    var filteredSchedule = _.filter(programmeList,(p)=>
      !_.contains(existedKeys,p.key));

    _.each(filteredSchedule,this.saveProgramme,this);

    this.loadSchedule();

  }

  parseProgramme(text,template){
    var ret={
      type:'unknow',
      year:template.year,
      month:-1,
      day:-1,
      start:'',
      end:'',
      channel:'',
      channelId:'',
      title:'',
      episode:'',
      members:'',
      orderKey:'',

      // format: provider_roomId(e.g. zhanqi_33968)
      roomId:'',
      roomTitle:''
    };

    var match=text.match(/(\d+)月(\d+)日（\S）/);
    if (match !== null){
      ret.type='date';
      ret.month=match[1];
      ret.day=match[2];
      return ret;
    }

    match=text.match(/(\S+)～(\S+)\s(.*)\s『(.*)』(\s#\d+)?(\s.*)?/);
    if (match !== null) {
      ret.month = template.month;
      ret.day = template.day;
      ret.type = 'programme-auto';
      ret.start = match[1];
      ret.end = match[2];
      ret.channel = match[3];
      ret.title = match[4];
      ret.episode = (match[5]||'').trim();
      ret.members = (match[6]||'').trim();

      var channelFound = false;
      for(let key in channels){
        var value = channels[key];
        if (ret.channel === value) {
          ret.channelId = key;
          channelFound = true;
          break;
        }
      }

      if (!channelFound){
        console.log(`ChannelId Not Found: ${ret.channel}`);
      }
    }

    return ret;
  }


  assertOrderKey(programme){
    var orderKey = programme.year;
    orderKey += (programme.month.length===2?programme.month:`0${programme.month}`);
    orderKey += (programme.day.length===2?programme.day:`0${programme.day}`);
    orderKey += programme.start;

    programme.orderKey = orderKey;

  }

  assertProgrammeKey(programme){
    var key = 'Programme:auto:';
    key += programme.month;
    key += ":";
    key += programme.day;
    key += ":";
    key += programme.start;
    key += ":";
    key += programme.channelId;

    programme.key = key;
  }

  getExpireSeconds(programme){
    // delay sechonds for key expire
    var offset = this.miki.config.expireOffset;

    var timeParts = programme.end.split(':');
    var hour = timeParts[0];
    var minute = timeParts[1];

    var hourOverflow = false;
    if (hour >= 24){
      hourOverflow = true;
      hour -=24;
    }

    var timeString = `${programme.year} ${programme.month} ${programme.day} ${hour} ${minute} +0900`;

    var endMonent = moment(timeString,'YYYY MM DD HH mm Z');
    if (hourOverflow) {
      endMonent.add(1,'day');
    }

    // console.log "end* " + endMoment.format('YYYY M D H m Z')
    var currentMoment = moment();

    // console.log "now* " + currentMoment.format('YYYY M D H m Z')
    var countdown = endMonent.diff(currentMoment,'second')+offset;

    return countdown;

  }

  // save programme to db
  saveProgramme(programme){
    // console.log("meru: saveProgramme()");
    // console.log(programme);
    var countdown = this.getExpireSeconds(programme);
    var action = countdown>0? 'SAVE':'SKIP';
    console.log(`${action}: ${programme.key}`);

    this.redis.hmset(programme.key,programme);
    this.redis.expire(programme.key,countdown);
  }

  loadSchedule(callback){
    this.schedule = [];

    this.redis.keys('Programme:*',(err,replies)=>{
      var remains = replies.length;
      console.log(`find ${remains} keys`);

      replies.map((key)=>{
        this.redis.hgetall(key,(err,replies)=>{
          this.schedule.push(replies);

          if (--remains === 0) {
            // all done
            this.schedule = _.sortBy(this.schedule,'orderKey');
            this.miki.updateSchedule(this.schedule);

            callback = callback || function(){};
            callback(null,this.schedule);

          }
        });
      });
    });
  }

  startService(){

    var url = this.miki.config.scheduleFetchRssUrl;
    var req =request(url);
    var feedparser = new FeedParser();

    var getTopArticle ={};
    getTopArticle =()=>{
      var article = feedparser.read();
      console.log(`parsing date: ${article.title}`);
      feedparser.removeListener('readable',getTopArticle);

      this.parseSchedule(article);
    };

    req.on('response',(res)=>{
      if (res.statusCode !== 200) {
        return request.emit('error',new Error('Bad status code'));
      }
      req.pipe(feedparser);
    });

    feedparser.on('readable',getTopArticle);

    var checker=(rss)=>{
      // todo

      setTimeout(checker,this.miki.config.scheduleCheckInterval);
    };

  }

}

export default Tashima;

