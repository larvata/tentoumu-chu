// import ScheduleStore from '../stores/ScheduleStore';

// todo rewrite addProgramme
// 
var addProgramme=(context, payload, done)=>{
  console.log("add programme");
  context.service.create('schedule', payload, {}, (err, schedule)=>{
    console.log("++++++++++++++++");
    console.log(schedule);
    context.dispatch('UPDATE_SCHEDULE',schedule);
    done();
  });
};

var updateProgramme=(context, payload, done)=>{
  console.log("update programme");
  context.service.update('schedule', payload, {}, (err, schedule)=>{
    context.dispatch('UPDATE_SCHEDULE',schedule);
    done();
  });
};

var deletePrgramme=(context, payload, done)=>{
  console.log("delete programme");
  context.service.delete('schedule', payload,{},(err, schedule)=>{

    context.dispatch('UPDATE_SCHEDULE',schedule);
    done();
  });
};


var getSchedule=(context,payload,done)=>{
  console.log("get schedule");
  context.service.read('schedule',{},{},(err,schedule)=>{
    console.log("read schedule");
    context.dispatch('UPDATE_SCHEDULE',schedule);
    done();
  });
};

export {addProgramme,updateProgramme,deletePrgramme,getSchedule};