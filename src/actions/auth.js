var auth=(context,payload,done)=>{
  console.log("auth");
  context.service.read('auth',{},{},(err,result)=>{
    console.log('get auth result');
    if (result) {
      context.dispatch('LOGIN_SUCCESS');
    }
    else{
      context.dispatch('LOGIN_FAIL');
    }
  })
}