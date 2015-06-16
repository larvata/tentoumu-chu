createStore = require('fluxible/addons').createStore
# miki = require('../services/miki')

ScheduleStore = createStore({

  storeName: 'ScheduleStore'
  handlers:
    'UPDATE_SCHEDULE': 'updateSchedule'

  initialize: ()->
    @schedule = {}

  getSchedule: ()->
    console.log "ScheduleStore: getSchedule()"
    return schedule

  updateSchedule: (schedule)->
    console.log "ScheduleStore: updateSchedule()"
    @schedule = schedule


})


module.exports = ScheduleStore
