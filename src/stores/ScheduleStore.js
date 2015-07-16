var ScheduleStore, createStore;

createStore = require('fluxible/addons').createStore;

ScheduleStore = createStore({
  storeName: 'ScheduleStore',
  handlers: {
    'UPDATE_SCHEDULE': 'updateSchedule',
    'RECEIVE_SCHEDULE': 'getSchedule',
    'ADD_PROGRAME': 'addProgramme'
    // 'UPDATE_PROGRAME': 'updateProgramme'
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
    // console.log(this.schedule.length);
  },
  addProgramme: function(programme) {
    this.schedule.push(programme);

    console.log("progamme added, emit()");
    this.emitChange();
  },
  removeProgramme: function(programme) {
    this.emitChange();
  },
  // updateProgramme: function(programme) {
  //   console.log("scheudle emit changes");
  //   this.emitChange();
  // },
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

module.exports = ScheduleStore;
