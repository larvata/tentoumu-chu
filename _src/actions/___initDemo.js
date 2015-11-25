export default (context, payload, done)=> {
  context.service.read('schedule', {}, {}, (err, schedule)=> {
    try{
      context.service.read('roomMeta',{},{},(err,roomMeta)=>{
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
