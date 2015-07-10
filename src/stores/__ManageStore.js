import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'ManageStore',
  handlers: {
    // 'UPDATE_SCHEDULE': 'updateSchedule',
    // 'RECEIVE_SCHEDULE': 'gSetchedule',
    // 'ADD_PROGRAME': 'addProgramme'
    'FILL_ManageStore': 'fillManageStore'
  },
  initialize: function() {
    console.log("ManageStore initialize");
    this.schedule = [];
  },
  fillManageStore: function(payload){

  },

  // getSchedule: function() {
  //   console.log("ManageStore: getSchedule()");
  //   console.log(this.schedule.length);
  //   return this.schedule;
  // },
  // updateSchedule: function(schedule) {
  //   console.log("ManageStore: updateSchedule()");
  //   this.schedule = schedule;
  //   this.emitChange();
  //   return console.log(this.schedule.length);
  // },
  // addProgramme: function(programme) {
  //   this.schedule.push(programme);
  //   return this.emitChange();
  // },
  // removeProgramme: function(programme) {
  //   return this.emitChange();
  // },
  // updateProgramme: function(programme) {
  //   return this.emitChange;
  // },
  dehydrate: function() {
    console.log("ManageStore: dehydrate");
    return {
      schedule: this.schedule
    };
  },
  rehydrate: function(state) {
    console.log("ManageStore: redydrate");
    this.schedule = state.schedule;
  }
});
