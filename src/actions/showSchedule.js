import ScheduleStore from '../stores/ScheduleStore';

export default (context, payload, done)=>{
  console.log("try fetch in showSchedule");
  context.service.read('schedule', {}, {}, (err, schedule)=>{
    console.log("try dispatch");
    context.dispatch('UPDATE_SCHEDULE', schedule);
    done();
  });
};
