export default (context, payload, done)=> {
  context.service.read('schedule', {}, {}, (err, schedule)=> {
    console.log("initManage: load schedule");

    try{
      context.service.read('roomMeta',{},{},(err,roomMeta)=>{
        console.log("initManage: load roomMeta");
        context.dispatch('UPDATE_ROOM_META',roomMeta);
        context.dispatch('UPDATE_SCHEDULE',schedule);
        done();
      });
    }
    catch(e){
      console.log(e);

    }
  });


};
