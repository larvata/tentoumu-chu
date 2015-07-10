import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'RoomMetaStore',
  handlers: {
    'UPDATE_ROOM_META': 'updateRoomMeta'
  },

  initialize: function(){
    console.log("RoomStore initialize");
    this.roomMeta=[];
  },
  updateRoomMeta: function(roomMeta){
    console.log("RoomStore updateRoomMeta");
    this.roomMeta = roomMeta;
    console.log(this.roomMeta.length);
    this.emitChange();
  },

  getRoomMeta: function(){
    // console.log("RoomStore: getRoom()");
    // console.log(this.roomMeta.length);
    return this.roomMeta;
  },

  dehydrate: function(){
    console.log("RoomStore: dehydrate");
    console.log(this.roomMeta.length);

    return {
      roomMeta: this.roomMeta
    };
  },

  rehydrate: function(state){
    console.log("RoomStore: rehydrate");
    console.log(state);
    this.roomMeta= state.roomMeta;
    console.log(this.roomMeta.length);
  }

});