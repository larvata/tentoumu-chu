import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'ScheduleStore',
  handlers: {
    'UPDATE_SCHEDULE': 'updateSchedule',
    'RECEIVE_SCHEDULE': 'getSchedule',
    'ADD_PROGRAME': 'addProgramme'
  },
  initialize: function() {
    console.log("ScheduleStore initialize");
    this.schedule = [];
  },
  getSchedule: function() {
    console.log("ScheduleStore: getSchedule()");
    console.log(this.schedule.length);
    return this.schedule;
  },
  updateSchedule: function(schedule) {
    console.log("ScheduleStore: updateSchedule()");
    this.schedule = schedule;
    this.emitChange();
    return console.log(this.schedule.length);
  },
  addProgramme: function(programme) {
    this.schedule.push(programme);
    return this.emitChange();
  },
  removeProgramme: function(programme) {
    return this.emitChange();
  },
  updateProgramme: function(programme) {
    return this.emitChange;
  },
  dehydrate: function() {
    console.log("ScheduleStore: dehydrate");
    
    return {
      schedule: this.schedule
    };
  },
  rehydrate: function(state) {
    console.log("ScheduleStore: redydrate");
    this.schedule = state.schedule;
  }
});
