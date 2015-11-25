export default{
  getInitialState: function(){
    return this.getInputCheckInitialState();
  },

  getInputCheckInitialState: function(){
    return {
      // programme: this.props.programme,
      dateIllegal:true,
      timeIllegal:true,
      dateText:this.getDateString(),
      timeText:this.getTimeString()
    };
  },

  componentWillMount: function(){
    this.setState({programmeOrigin:Object.assign({},this.state.programme)});
  },

  // date
  getDateString: function(){
    var source = this.state || this.props;
    if (source.programme === undefined) {
      // programme not found in both state and props
      return "";
    }


    var date = source.programme.month +"/" + source.programme.day;
    var ret= this.validateDate(date)?date:'';

    return ret;
  },

  getDateParts: function(date){
    return date.match(/(\d+)\/(\d+)/);
  },

  setDateState: function(){
    var date = this.refs.date.getDOMNode().value;
    var parts = this.getDateParts(date);
    var [,month,day]=parts||['','',''];

    Object.assign(this.state.programme,{month,day});

    this.setState({programme: this.state.programme});
    this.setState({dateText:date});
    this.setState({dateIllegal:!parts}); 
  },

  validateDate: function(date){
    var parts = this.getDateParts(date);
    if (parts === null) {return false;}

    var [,month,day]=parts||['','',''];
    if (month>12) { return false; }
    if (day>31) { return false; }

    return true;
  },

  validateDateChanged: function(){
    if (this.state.programme.month !== this.state.programmeOrigin.month) {
      return true;
    }
    if (this.state.programme.day !== this.state.programmeOrigin.day) {
      return true;
    }
    return false;
  },

  getDateClass: function(){

    if (!this.validateDate(this.state.dateText)) {
      return {backgroundColor:"red",color:"white"};
    }
    if (this.validateDateChanged()) {
      return {backgroundColor:"yellow"};
    }

    return {};
  },

  // time
  getTimeString:function(){
    var source = this.state || this.props;

    if (source.programme === undefined) {
      // rogramme not found in both state and props
      return "";
    }


    var time = source.programme.start + "~" + source.programme.end;
    var ret = this.validateTime(time)?time:'';

    return ret;
  },

  getTimeParts: function(time){
    return time.match(/(\d+:\d+)~(\d+:\d+)/);
  },

  setTimeState: function(){
    var time = this.refs.time.getDOMNode().value;
    var parts = this.getTimeParts(time);
    var [,start,end]=parts||['','',''];

    Object.assign(this.state.programme,{start,end});

    this.setState({programme: this.state.programme});
    this.setState({timeText:time});
    this.setState({timeIllegal:!parts});
  },

  validateTime: function(time){
    return !!this.getTimeParts(time);
  },

  validateTimeChanged: function(){
    if (this.state.programme.start !== this.state.programmeOrigin.start) {
      return true;
    }
    if (this.state.programme.end !== this.state.programmeOrigin.end) {
      return true;
    }
    return false;
  },


  getTimeClass: function(){
    if (!this.validateTime(this.state.timeText)) {
      return {backgroundColor:"red",color:"white"};
    }
    if (this.validateTimeChanged()) {
      return {backgroundColor:"yellow"};
    }

    return {};
  },

  canAddNew: function(){
    if (true) {}
  }




};