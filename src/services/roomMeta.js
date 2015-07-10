import miki from '../assistance/miki';

export default {
  name: 'roomMeta',
  read: function(req,resource,params,config,callback){
    var rooms;
    console.log("+try fetch rooms");
    console.log(callback);
    var roomMeta = miki.getRoomMeta();
    return callback(null,roomMeta);
  }
};