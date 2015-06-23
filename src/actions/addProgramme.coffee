ScheduleStore = require '../stores/ScheduleStore'

module.exports= (context,payload,done)->
  console.log "add programme"
  context.service.create 'schedule',payload,{},(err,schedule)->
    console.log "call api done try dispatch ADD_PROGRAME"
    # console.log schedule
    context.dispatch('ADD_PROGRAME',schedule)
    done()

