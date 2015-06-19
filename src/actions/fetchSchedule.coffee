module.exports=(context,payload,done)->
  # context.dispatch('FETCH_SCHEDULE_START')
  context.service.read 'schedule',{},{},(err,schedule)->
    console.log "fetch schedule done"
    context.dispatch('UPDATE_SCHEDULE',schedule)
    done()
