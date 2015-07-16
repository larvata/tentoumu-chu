// import ScheduleStore from '../stores/ScheduleStore';

var addProgramme=(context, payload, done)=>{
  console.log("add programme");
  context.service.create('schedule', payload, {}, (err, schedule)=>{
    console.log("call api done try dispatch ADD_PROGRAME");
    context.dispatch('ADD_PROGRAME', schedule);
    done();
  });
};

var updateProgramme=(context, payload, done)=>{
  console.log("update programme");
  context.service.update('schedule', payload, {}, (err, schedule)=>{
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

export {addProgramme,updateProgramme,getSchedule};