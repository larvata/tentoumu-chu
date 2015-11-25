import request from 'request';
import FeedParser from 'feedparser';
import cheerio from 'cheerio';
import _ from 'lodash';
import moment from 'moment';

import Agent from 'socks5-http-client/lib/Agent';

// import Redis from 'ioredis';
// var redis = new Redis();


const channels = {
    'tbs': 'TBS',
    'tbs-bs': 'BS-TBS',
    'tbs-1': 'TBSチャンネル1',

    'ntv': '日本テレビ',
    'ntv-bs': 'BS日テレ',
    'ntv-plus': '日テレプラス',

    'nhk-variety': 'NHK総合',
    'nhk-edu-1': 'NHK Eテレ1',
    'nhk-bs-1': 'NHK BS1',
    'nhk-bs-perm': 'NHK BSプレミアム',
    'nhk-edu': 'NHK Eテレ',

    'asashi': 'テレビ朝日',
    'asashi-bs': 'BS朝日',

    'tokyo': 'テレビ東京',
    'tokyo-mx-1': 'TOKYO MX1',

    'fuji': 'フジテレビ',
    'fuji-one': 'フジテレビONE',
    'fuji-next': 'フジテレビNEXT',

    'j-sports-3': 'J SPORTS 3',

    'fami-geki': 'ファミリー劇場',

    'chiba': 'チバテレ',

    'green': 'グリーンチャンネル',

    'lala': 'LaLa TV',

    'wowow-prime': 'WOWOWプライム',
    'wowow-live': 'WOWOWライブ',
    'wowow-cinema': 'WOWOWシネマ',

    'musicontv': 'MUSIC ON! TV',

    'tvk': 'tvk',

    'dhc': 'DHCシアター',
    'dhc-theater': 'DHCシアター カルチャー＆エンターテインメント',

    'space-shower': 'スペースシャワーTV',

    'bs-japan': 'BSジャパン',
    'bs-sp': 'BSスカパー!',
    'sp-4k': 'スカパー!4K',

    'teletama': 'テレ玉',

    'kayopops': '歌謡ポップスch',
    'kayopops-alais': '歌謡ポップスチャンネル',

    'movie-neco': '映画・チャンネルNECO',
    'dlife': 'Dlife'
};


class Tashima{
    constructor(miki){
        this.miki = miki;

        this.schedule = ['1'];

        // // warm up data
        // this.loadSchedulesFromStorage()
        this.miki.getSchedule()
        .then((ret)=>{
            console.log("try get init schedules")
            console.log(ret.length)
            this.schedule = ret;
        }).catch((err)=>{
            console.log('error on init scheduel')
            console.log(error)
        });
    }

    // loadSchedulesFromStorage(){
    //     console.log('call loadSchedule')
    //     return new Promise((resolve, reject)=>{
    //         this.schedules = [];

    //         redis.keys('Programme:*', (err, replies)=>{
    //             console.log('in redis keys')
    //             if (err) {
    //                 reject(err);
    //             }fg

    //             var remains = replies.length;
    //             console.log(`find ${remains} keys`);

    //             replies.map((key)=>{
    //                 redis.hgetall(key, (err, replies)=>{
    //                     if (err) {
    //                         reject(err);
    //                     }

    //                     this.schedules.push(replies);

    //                     if (--remains === 0) {
    //                         // all done
    //                         this.schedules = _.sortBy(this.schedules, 'orderKey');
    //                         this.miki.updateSchedule(this.schedules);
    //                         resolve(null, this.schedules);
    //                     }
    //                 });
    //             });
    //         });
    //     });
    // }

    // save programme to db
    saveProgramme(programme){
        // console.log("meru: saveProgramme()");
        // console.log(programme);
        var countdown = this.getExpireSeconds(programme);
        var action = countdown>0? 'SAVE': 'SKIP';
        console.log(`${action}: ${programme.key}`);

        this.miki.saveProgramme(programme, countdown);

        // this.redis.hmset(programme.key, programme);
        // this.redis.expire(programme.key, countdown);
    }

    getExpireSeconds(programme){
        // delay sechonds for key expire
        var offset = this.miki.configs.expireOffset;

        var timeParts = programme.end.split(': ');
        var hour = timeParts[0];
        var minute = timeParts[1];

        var hourOverflow = false;
        if (hour >= 24){
          hourOverflow = true;
          hour -=24;
        }

        var timeString = `${programme.year} ${programme.month} ${programme.day} ${hour} ${minute} +0900`;

        var endMonent = moment(timeString, 'YYYY MM DD HH mm Z');
        if (hourOverflow) {
          endMonent.add(1, 'day');
        }

        // console.log "end* " + endMoment.format('YYYY M D H m Z')
        var currentMoment = moment();

        // console.log "now* " + currentMoment.format('YYYY M D H m Z')
        var countdown = endMonent.diff(currentMoment, 'second')+offset;

        return countdown;

    }


    parseProgramme(text, template){
        var ret={
            type: 'unknow',
            year: template.year,
            month: -1,
            day: -1,
            start: '',
            end: '',
            channel: '',
            channelId: '',
            title: '',
            episode: '',
            members: '',
            orderKey: '',

            // format: provider_roomId(e.g. zhanqi_33968)
            roomId: '',
            roomTitle: ''
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
        key += ':';
        key += programme.day;
        key += ':';
        key += programme.start;
        key += ':';
        key += programme.channelId;

        programme.key = key;
      }

    parseSchedule(article){
        var $ = cheerio.load(article.description, {decodeEntities: false});
        var text = $.html().split('<br>');

        var m=moment(article.pubdate);
        var lastTemplate={
          year: m.year()
        };

        var dayCount=0;
        var programmeList=[];

        for(var t of text){
          if (dayCount === 3) {
            break;
          }

          var ret = this.parseProgramme(t, lastTemplate);
          if (ret.type === 'date') {
            dayCount++;
            lastTemplate = ret;
          }
          else if (ret.type === 'programme-auto'){
            this.assertOrderKey(ret);
            this.assertProgrammeKey(ret);
            // console.log(ret)
            programmeList.push(ret);
          }
        }

        //filter programme with existed key
        var existedKeys = _.pluck(this.schedule, 'key');

        var filteredSchedule = _.filter(programmeList, (p)=>
          !_.contains(existedKeys, p.key));

        _.each(filteredSchedule, this.saveProgramme, this);

        // this.miki.getSchedule()
        // .then((ret)=>{
        //     console.log('loadSchedule() resolved in parseSchedule');
        //     console.log(ret);
        // })
        // .catch((err)=>{
        //     console.log('error on get schedules')
        //     console.log(err)
        // });
    }

    _checkService(){
        console.log("start fetch")
        var url = this.miki.configs.scheduleFetchRssUrl;

        // var req = request(url);
        var req = request({
            url: url,
            agentClass: Agent,
            agentOptions: {
                socksPort: 8484
            }
        });
        req.on('response', (res)=>{
            if (res.statusCode !== 200) {
                return request.emit('error', new Error('Bad status code'));
            }
            req.pipe(feedparser);
        });

        var feedparser = new FeedParser();
        var _getTopMostArticle = getTopMostArticle.bind(this);
        function getTopMostArticle(){
            var article = feedparser.read();
            feedparser.removeListener('readable', _getTopMostArticle);
            this.parseSchedule(article);
            console.log("fully loaded, wait for " + this.miki.configs.scheduleFetchInterval/1000 + " seconds and fetch again");


            console.log('try get current schedules')
            // this.miki.getSchedule()
            // .then((ret)=>{
            //     console.log("sudccess call miki getSchedule in getTopMostArticle");
            //     console.log(ret.length)
            // })
            // .catch((err)=>{
            //     console.log('error on calling miki getSchedule')
            //     console.log(err)
            // })

            setTimeout(this._checkService.bind(this), this.miki.configs.scheduleFetchInterval);
        }
        feedparser.on('readable', _getTopMostArticle);

    }

    startService(){
        this._checkService();
    }
}

export default Tashima;
