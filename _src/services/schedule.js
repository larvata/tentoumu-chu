import miki from '../assistance/miki';

export default {
  name: 'schedule',
  read: function(req, resource, params, config, callback) {
    var schedule = miki.getSchedule();
    return callback(null, schedule);
  },
  create: function(req, resource, params, body, config, callback) {
    miki.addProgramme(params,callback);
  },
  update: function(req, resource, params, body, config, callback) {
    console.log("+try update programme");
    miki.updateProgramme(params,callback);
  },
  delete: function(req, source, params, config, callback){
    console.log("+try delete programme");
    miki.deleteProgramme(params,callback);
    
  }
};