miki = require './miki'

module.exports = {
  name: 'schedule'
  read: (req,resource,params,config,callback)->
    console.log "+try fetch schedule"
    console.log callback
    schedule = miki.getSchedule()
    callback(null,schedule)

  create: (req,resource,params,body,config,callback)->
    console.log "+try create programme"
    console.log "params"
    console.log params
    console.log "body"
    console.log body
    console.log callback
    # schedule = miki.addProgramme(resource)
    callback(null,params)

  # create, update,delete
}
