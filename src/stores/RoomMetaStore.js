import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'RoomMetaStore',
  handlers: {
    'UPDATE_ROOM_META': 'updateRoomMeta'
  },

  initialize: function(){
    this.roomMeta=[];
  },
  updateRoomMeta: function(roomMeta){
    this.roomMeta = roomMeta;
    this.emitChange();
  },

  getRoomMeta: function(){
    return this.roomMeta;
  },

  dehydrate: function(){
    return {
      roomMeta: this.roomMeta
    };
  },

  rehydrate: function(state){
    this.roomMeta= state.roomMeta;
  }

});