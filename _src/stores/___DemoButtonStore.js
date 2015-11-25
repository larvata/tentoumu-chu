import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'DemoButtonStore',


  initialize: function(){
    this.buttons=[{
      id:1,
      content:"aaa"
    },{
      id:2,
      content:"bbb"
    },{
      id:3,
      content:"ccc"
    },{
      id:4,
      content:"ddd"
    }];
  },

  getButtons: function(){
    return this.buttons;
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