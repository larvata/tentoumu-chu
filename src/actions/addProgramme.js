import ScheduleStore from '../stores/ScheduleStore';

export default (context, payload, done)=>{
  console.log("add programme");
  context.service.create('schedule', payload, {}, (err, schedule)=>{
    console.log("call api done try dispatch ADD_PROGRAME");
    context.dispatch('ADD_PROGRAME', schedule);
    done();
  });
};