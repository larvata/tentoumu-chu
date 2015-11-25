export default (context, payload, done)=> {
  context.service.read('schedule', {}, {}, (err, schedule)=> {
    console.log("fetch schedule done");
    context.dispatch('UPDATE_SCHEDULE', schedule);
    done();
  });
};
