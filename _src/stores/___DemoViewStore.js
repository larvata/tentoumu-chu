import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'DemoViewStore',
  handlers: {
    'LOAD_VIEW': 'loadView'
  },


  initialize: function(){
    this.view={content:"aaa"};
  },

  loadView: function(payload){
    console.log("store:loadview:payload")
    console.log(payload)
    if (payload) {
      this.view= payload;
    }
    
    this.emitChange();
  },
  getView: function(){
    console.log("store:getview - ----------")
    console.log(this.view)
    return this.view;
  },

  dehydrate: function(){
    return {
      demoButtons: this.buttons
    };
  },

  rehydrate: function(state){
    this.buttons= state.demoButtons;
  }

});