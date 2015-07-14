import miki from '../assistance/miki';

export default {
  name: 'schedule',
  read: function(req, resource, params, config, callback) {
    var schedule;
    console.log("+try fetch schedule");
    console.log(callback);
    schedule = miki.getSchedule();
    return callback(null, schedule);
  },
  create: function(req, resource, params, body, config, callback) {
    console.log("+try create programme");
    console.log("params");
    console.log(params);
    console.log("body");
    console.log(body);
    console.log(callback);
    miki.addProgramme(params);
    return callback(null, params);
  },
  update: function(req, resource, params, body, config, callback) {
    console.log("+try update programme");
    miki.updateProgramme(params);
    return callback(null,params);
  }
};