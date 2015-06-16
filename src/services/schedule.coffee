miki = require './miki'

module.exports = {
  name: 'schedule'
  read: (req,resource,params,config,callback)->
    schedule = miki.getSchedule()
    callback(null,schedule)

  # create, update,delete
}
