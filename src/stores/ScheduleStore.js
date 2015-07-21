import _ from 'underscore';
import {createStore} from 'fluxible/addons';

var ScheduleStore = createStore({
  storeName: 'ScheduleStore',
  handlers: {
    'UPDATE_SCHEDULE': 'updateSchedule',
    // 'RECEIVE_SCHEDULE': 'getSchedule',
    'ADD_PROGRAMME': 'addProgramme',
    // 'DELETE_PROGRAMME': 'deleteProgramme'
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
  // addProgramme: function(schedule) {
  //   // this.schedule.push(programme);

  //   console.log("programme added, emit()");
  //   this.emitChange();
  // },
  // deleteProgramme: function(schedule) {
  //   // this.schedule = _.filter(this.schedule,function(p){
  //   //   return p.key !== programme.key;
  //   // });

  //   // delete logic is in miki and meru
  //   this.emitChange();
  // },
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
