export default {
  // setTimeState: time=>{
  //   var ret = /\d+:\d+~\d+:\d+/.test(time);

  //   set

  // },
  // setDateState: date=>{
  //   var ret = /\d+\/\d+/.test(date);
  // }

  setTimeState: function(){
    var time = this.refs.time.getDOMNode().value;
    var ret = /\d+:\d+~\d+:\d+/.test(time);

    this.setState({"timeIllegal":!ret});

  },
  setDateState: function(){
    var date = this.refs.date.getDOMNode().value;
    var ret = /\d+\/\d+/.test(date);

    this.setState({"dateIllegal":!ret});
  }
};