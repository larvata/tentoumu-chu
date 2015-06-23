miki = require './miki'

module.exports = {
  name: 'schedule'
  read: (req,resource,params,config,callback)->
    schedule = miki.getSchedule()
    callback(null,schedule)

  create: (req,resource,params,config,callback)->
    console.log "try create programme"
    console.log resource
    # schedule = miki.addProgramme(resource)
    callback(null,schedule)

  # create, update,delete
}
