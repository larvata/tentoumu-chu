import _ from 'underscore';

var parallels = (dataRouters, context, routerState, cb)=>{
  var count = dataRouters.length;

  for(var i in dataRouters){
    var router = dataRouters[i];
    router.handler.fetchData(context,routerState.params,routerState.query,(err)=>{
      if (--count){
        console.log(`task last: ${count}`);
      }else{
        console.log("all done. call callback");
        return cb();
      }
    });
  }
};

var fetchData = (context, routerState, cb)=>{
  var dataRouters = _.filter(routerState.routes,(route)=>{
    return route.handler.fetchData;
  });
  if(dataRouters.length === 0){
    cb();
  }

  parallels(dataRouters,context,routerState,cb);

};

export default fetchData;