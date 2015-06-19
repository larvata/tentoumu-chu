createStore = require('fluxible/addons').createStore
# miki = require('../services/miki')

ScheduleStore = createStore({

  storeName: 'ScheduleStore'
  handlers:
    'UPDATE_SCHEDULE': 'updateSchedule'
    'RECEIVE_SCHEDULE': 'getSchedule'

  initialize: ()->
    console.log "ScheduleStore initialize"
    @schedule = []

  getSchedule: ()->
    console.log "ScheduleStore: getSchedule()"
    console.log @schedule.length
    return @schedule

  updateSchedule: (schedule)->
    console.log "ScheduleStore: updateSchedule()"
    @schedule = schedule
    console.log @schedule.length

  dehydrate:()->
    console.log "ScheduleStore: dehydrate"
    return {
      schedule: @schedule
    }

  redydrate:(state)->
    console.log "ScheduleStore: redydrate"
    @schedule=state.schedule


})


module.exports = ScheduleStore
