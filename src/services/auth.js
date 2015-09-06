import kojimako from '../assistance/kojimako'

export default {
  name:'auth',
  read: function(req,resource,params,config,callback){
    console.log('+try auth');
    var ret = kojimako.auth(params.user,params.key);
    return callback(null,ret);
  }

}