import miki from '../assistance/miki';

export default {
  name: 'roomMeta',
  read: function(req,resource,params,config,callback){
    console.log("+try fetch rooms");
    var roomMeta = miki.getRoomMeta();
    return callback(null,roomMeta);
  }
};