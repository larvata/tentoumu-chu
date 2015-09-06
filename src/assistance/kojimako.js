import auths from '../configs/auths'

class Kojimako{
  constructor(){

  }

  auth(user,password){
    auths.forEach(v=>{
      if (v.user === user && v.key === password) {
        return true;
      }
    });

    return false;
  }
}

export default new Kojimako()

