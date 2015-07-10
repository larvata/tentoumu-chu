createStore = require('fluxible/addons').createStore
# miki = require('../services/miki')

ScheduleStore = createStore({

  storeName: 'ScheduleStore'
  handlers:
    'UPDATE_SCHEDULE': 'updateSchedule'
    'RECEIVE_SCHEDULE': 'getSchedule'
    'ADD_PROGRAME': 'addProgramme'

  initialize: ()->
    console.log "ScheduleStore initialize"
    @schedule = []

    # console.log "try rehydrate in ScheduleStore initialize()"
    # console.log @state
    # @rehydrate(state)

  getSchedule: ()->
    console.log "ScheduleStore: getSchedule()"
    console.log @schedule.length
    return @schedule

  updateSchedule: (schedule)->
    console.log "ScheduleStore: updateSchedule()"
    @schedule = schedule
    @emitChange()
    console.log @schedule.length

  addProgramme: (programme)->
    @schedule.push(programme)
    @emitChange()

  removeProgramme:(programme)->

    @emitChange()

  updateProgramme:(programme)->
    @emitChange

  dehydrate:()->
    console.log "ScheduleStore: dehydrate"
    return {
      schedule: @schedule
    }

  rehydrate:(state)->
    console.log "ScheduleStore: redydrate"
    @schedule=state.schedule


  # shouldDehydrate:()->
  #   return true

})


module.exports = ScheduleStore
