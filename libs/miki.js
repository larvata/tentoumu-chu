// Generated by CoffeeScript 1.9.1
var Miki, _, cheerio, fs, moment, phantom, redis, redisModule, rooms, schedule;

redisModule = require('redis');

phantom = require('phantom');

_ = require('underscore');

cheerio = require('cheerio');

fs = require('fs');

moment = require('moment');

schedule = [];

rooms = [];

redis = {};

Miki = (function() {
  var channels;

  function Miki(config) {
    this.config = config;
    this.assertConfig();
    console.log("redis server: " + this.config.redis_host + ":" + this.config.redis_port);
    redis = redisModule.createClient(this.config.redis_port, this.config.redis_host);
  }

  Miki.prototype.assertConfig = function() {
    var base, base1, base10, base11, base12, base13, base14, base15, base16, base17, base18, base2, base3, base4, base5, base6, base7, base8, base9;
    if ((base = this.config).managePath == null) {
      base.managePath = 'manage.html';
    }
    if ((base1 = this.config).token == null) {
      base1.token = 'token';
    }
    if ((base2 = this.config).host == null) {
      base2.host = '127.0.0.1';
    }
    if ((base3 = this.config).port == null) {
      base3.port = 3434;
    }
    if ((base4 = this.config).redis_host == null) {
      base4.redis_host = '127.0.0.1';
    }
    if ((base5 = this.config).redis_port == null) {
      base5.redis_port = 6379;
    }
    if ((base6 = this.config).headless == null) {
      base6.headless = 'headless';
    }
    if ((base7 = this.config).douyuRoomAPI == null) {
      base7.douyuRoomAPI = "http://www.douyutv.com/api/client/room/";
    }
    if ((base8 = this.config).douyuAvatarAPI == null) {
      base8.douyuAvatarAPI = "http://uc.douyutv.com/avatar.php";
    }
    if ((base9 = this.config).douyuWebPicUrl == null) {
      base9.douyuWebPicUrl = "http://staticlive.douyutv.com/upload/web_pic";
    }
    if ((base10 = this.config).zhanqiRoomAPI == null) {
      base10.zhanqiRoomAPI = "http://www.zhanqi.tv/api/static/live.roomid/";
    }
    if ((base11 = this.config).zhanqiAvatarAPI == null) {
      base11.zhanqiAvatarAPI = "http://pic.cdn.zhanqi.tv/avatar";
    }
    if ((base12 = this.config).zhanqiWebPicUrl == null) {
      base12.zhanqiWebPicUrl = "http://dlpic.cdn.zhanqi.tv/live";
    }
    if ((base13 = this.config).roomCheckInterval == null) {
      base13.roomCheckInterval = 120000;
    }
    if ((base14 = this.config).scheduleFetchRssUrl == null) {
      base14.scheduleFetchRssUrl = "http://feedblog.ameba.jp/rss/ameblo/akb48tvinfo/rss20.xml";
    }
    if ((base15 = this.config).scheduleTemplatesKey == null) {
      base15.scheduleTemplatesKey = "scheduleTemplates";
    }
    if ((base16 = this.config).scheduleCheckInterval == null) {
      base16.scheduleCheckInterval = 120000;
    }
    if ((base17 = this.config).apiVersions == null) {
      base17.apiVersions = {
        'v1': 'v1'
      };
    }
    if ((base18 = this.config).expireOffset == null) {
      base18.expireOffset = 0;
    }

    /*
      generate schedule pic
     */
    this.generaterTimer = void 0;
    return this.generater = (function(_this) {
      return function() {
        var headlessUrl;
        headlessUrl = "http://" + _this.config.host + ":" + _this.config.port + "/" + _this.config.headless;
        return phantom.create(function(ph) {
          return ph.createPage(function(page) {
            return page.open(headlessUrl, function(status) {
              page.render('static_content/schedule.png');
              console.log("Output on " + new Date());
              return ph.exit();
            });
          });
        });
      };
    })(this);
  };

  Miki.prototype.generatePic = function() {
    clearTimeout(this.generaterTimer);
    return this.generaterTimer = setTimeout(this.generater, 5000);
  };

  Miki.prototype.warmup = function() {
    return this.loadSchedule();
  };

  Miki.prototype.loadSchedule = function() {
    schedule = [];
    return redis.keys('programme:*', function(err, replies) {
      var remains;
      remains = replies.length;
      return replies.map(function(key) {
        return redis.hgetall(key, function(err, replies) {
          schedule.push(replies);
          if (--remains === 0) {
            console.log("[miki] finish load schedule");
            return schedule = _.sortBy(schedule, 'orderKey');
          }
        });
      });
    });
  };

  Miki.prototype.getSchedule = function() {
    return schedule;
  };

  Miki.prototype.getRooms = function() {
    return rooms;
  };

  Miki.prototype.updateRoom = function(room) {
    var roomExisted;
    roomExisted = _.find(rooms, function(r) {
      return r.room_id === room.room_id;
    });
    if (roomExisted != null) {
      roomExisted.show_status = room.show_status;
      roomExisted.room_name = room.room_name;
      return roomExisted.show_time = room.show_time;
    } else {
      return rooms.push(room);
    }
  };

  Miki.prototype.createRequestOptions = function(url, host) {
    var headers, options;
    headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': host,
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.2 Safari/537.36'
    };
    options = {
      url: url,
      headers: headers,
      gzip: true,
      agent: false,
      timeout: 7000
    };
    console.log("REQUEST: " + url);
    return options;
  };

  channels = {
    'tbs': 'TBS',
    'tbs-bs': 'BS-TBS',
    'tbs-1': 'TBSチャンネル1',
    'ntv': '日本テレビ',
    'ntv-bs': 'BS日テレ',
    'ntv-plus': '日テレプラス',
    'nhk-variety': 'NHK総合',
    'nhk-e-1': 'NHK Eテレ1',
    'nhk-bs-perm': 'NHK BSプレミアム',
    'asashi': 'テレビ朝日',
    'asashi-bs': 'BS朝日',
    'tokyo': 'テレビ東京',
    'tokyo-mx-1': 'TOKYO MX1',
    'fuji': 'フジテレビ',
    'j-sports-3': 'J SPORTS 3',
    'fami-geki': 'ファミリー劇場',
    'chiba': 'チバテレ',
    'green': 'グリーンチャンネル',
    'lala': 'LaLa TV'
  };

  Miki.prototype.parseProgramme = function(text, template) {
    var channelFound, k, match, ret, v;
    ret = {
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
      roomId: '',
      roomTitle: ''
    };
    match = text.match(/(\d+)月(\d+)日（\S）/);
    if (match != null) {
      ret.type = 'date';
      ret.month = match[1];
      ret.day = match[2];
      return ret;
    }
    match = text.match(/(\S+)～(\S+)\s(.*)\s『(.*)』(\s#\d+)?(\s.*)?/);
    if (match != null) {
      ret.month = template.month;
      ret.day = template.day;
      ret.type = 'programme';
      ret.start = match[1];
      ret.end = match[2];
      ret.channel = match[3];
      ret.title = match[4];
      ret.episode = (match[5] || '').trim();
      ret.members = (match[6] || '').trim();
      channelFound = false;
      for (k in channels) {
        v = channels[k];
        if (ret.channel === v) {
          ret.channelId = k;
          channelFound = true;
          break;
        }
      }
      if (!channelFound) {
        console.log("ChannelId Not Found: " + ret.channel);
      }
      return ret;
    }
    return ret;
  };

  Miki.prototype.parseSchedule = function(article) {
    var $, dayCount, i, lastTemplate, len, m, programmeList, ret, t, text;
    $ = cheerio.load(article.description, {
      decodeEntities: false
    });
    text = $.html().split('<br>');
    m = moment(article.pubdate);
    lastTemplate = {
      year: m.year()
    };
    dayCount = 0;
    programmeList = [];
    for (i = 0, len = text.length; i < len; i++) {
      t = text[i];
      if (dayCount === 3) {
        break;
      }
      ret = this.parseProgramme(t, lastTemplate);
      if (ret.type === 'date') {
        dayCount++;
        lastTemplate = ret;
      } else if (ret.type === 'programme') {
        this.assertOrderKey(ret);
        this.assertProgrammeKey(ret);
        programmeList.push(ret);
      }
    }
    return programmeList;
  };

  Miki.prototype.assertOrderKey = function(programme) {
    var orderKey;
    orderKey = programme.year;
    orderKey += (programme.month.length === 2 ? programme.month : "0" + programme.month);
    orderKey += (programme.day.length === 2 ? programme.day : "0" + programme.day);
    orderKey += programme.start;
    return programme.orderKey = orderKey;
  };

  Miki.prototype.assertProgrammeKey = function(programme) {
    var key;
    key = "programme:";
    key += programme.month;
    key += ":";
    key += programme.day;
    key += ":";
    key += programme.start;
    key += ":";
    key += programme.channelId;
    return programme.key = key;
  };

  Miki.prototype.getExpireSeconds = function(programme) {
    var countdown, currentMoment, endMoment, hour, hourOverflow, minute, offset, timeParts, timeString;
    offset = this.config.expireOffset;
    timeParts = programme.end.split(':');
    hour = timeParts[0];
    minute = timeParts[1];
    if (hour >= 24) {
      hourOverflow = true;
      hour -= 24;
    } else {
      hourOverflow = false;
    }
    timeString = programme.year + " " + programme.month + " " + programme.day + " " + hour + " " + minute + " +0900";
    endMoment = moment(timeString, 'YYYY MM DD HH mm Z');
    if (hourOverflow) {
      endMoment.add(1, 'day');
    }
    currentMoment = moment();
    countdown = endMoment.diff(currentMoment, 'second') + offset;
    return countdown;
  };

  Miki.prototype.saveProgramme = function(programme) {
    var countdown;
    countdown = this.getExpireSeconds(programme);
    console.log("save key: " + programme.key);
    redis.hmset(programme.key, programme);
    return redis.expire(programme.key, countdown);
  };

  Miki.prototype.updateSchedule = function(article) {
    var existedKeys, filteredSchedule, i, len, p, parsedSchedule;
    parsedSchedule = this.parseSchedule(article);
    existedKeys = _.pluck(schedule, 'key');
    filteredSchedule = _.filter(parsedSchedule, function(p) {
      var ret;
      ret = !_.contains(existedKeys, p.key);
      return ret;
    });
    for (i = 0, len = filteredSchedule.length; i < len; i++) {
      p = filteredSchedule[i];
      this.saveProgramme(p);
    }
    return this.loadSchedule();
  };

  return Miki;

})();

module.exports = Miki;
