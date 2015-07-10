export default {
  checkTimeFormat: time=>{

    if (/\d+:\d+~\d+:\d+/.test(time)) {
      return true;
    }
    else{
      return false;
    }
  },

  checkDateFormat: date=>{
    
    if (/\d+\/\d+/.test(date)) {
      this.setState({"dateIllegal":false});
    }
    else{
      this.setState({"dateIllegal":true});
    }

  }


};