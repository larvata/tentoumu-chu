var loadDemoView=(context, payload, done)=>{

  context.dispatch('LOAD_VIEW',payload);
  done();

};


export {loadDemoView};