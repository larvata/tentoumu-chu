ScheduleStore = require '../stores/ScheduleStore'

module.exports= (context,payload,done)->
  console.log "try fetch in showSchedule"
  context.service.read 'schedule',{},{},(err,schedule)->
    console.log "try dispatch"
    # console.log schedule
    context.dispatch('UPDATE_SCHEDULE',schedule)
    done()

