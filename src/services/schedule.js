// Generated by CoffeeScript 1.9.3
var miki;

miki = require('./miki');

module.exports = {
  name: 'schedule',
  read: function(req, resource, params, config, callback) {
    var schedule;
    schedule = miki.getSchedule();
    return callback(null, schedule);
  },
  create: function(req, resource, params, config, callback) {
    console.log("try create programme");
    console.log(resource);
    return callback(null, schedule);
  }
};