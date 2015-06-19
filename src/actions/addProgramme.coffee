ScheduleStore = require '../stores/ScheduleStore'

module.exports= (context,payload,done)->
  console.log "add programme"
  context.service.add 'schedule',{},{},(err,schedule)->
    console.log "try dispatch"
    # console.log schedule
    context.dispatch('UPDATE_SCHEDULE',schedule)
    done()

