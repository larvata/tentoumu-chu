var React = require('react')
var ReactPropTypes = React.PropTypes;
var {addProgramme} = require('../../actions/programme')
var ScheduleStore = require('../../stores/ScheduleStore');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var helper = require('../../utils/scheduleHelper');

var uuid = require('node-uuid');

var RoomMetaList = require('./RoomMetaList.jsx');



var ProgrammeNewListItem = React.createClass({

  mixins: [FluxibleMixin],

  propTypes: {
    programme: React.PropTypes.object
  },

  getInitialState:function(){
    return {
      dateIllegal:true,
      timeIllegal:true
    }
  },

  handleAddProgramme:function(e){
    var date = React.findDOMNode(this.refs.date).value;
    var time = React.findDOMNode(this.refs.time).value;
    var title = React.findDOMNode(this.refs.title).value;
    var members= React.findDOMNode(this.refs.members).value;


    // TODO move progamme create to addProgrammeAction
    var month = date.split('/')[0];
    var day = date.split('/')[1];
    var start = time.split('~')[0];
    var end = time.split('~')[1];
    var type="programme-custom";
    // key = type+":"+start+":"+end
    var key = type+":"+uuid.v1();

    var programme= {
      day: day,
      end: end,
      key: key,
      members: members,
      month: month,
      start: start,
      title: title,
      type: type,
      year: 2015
    }

    context.executeAction(addProgramme,programme,function(){
      console.log("execute action addProgramme done");
    })

    // this.getStore(ScheduleStore).addProgramme()

    React.findDOMNode(this.refs.date).value='';
    React.findDOMNode(this.refs.time).value='';
    React.findDOMNode(this.refs.title).value='';
    React.findDOMNode(this.refs.members).value='';
  },

  handleDateChange:function(e){
    var date = React.findDOMNode(this.refs.date).value;

    if (/\d+\/\d+/.test(date)) {
      this.setState({"dateIllegal":false});
    }
    else{
      this.setState({"dateIllegal":true});
    }

  },

  handleTimeChange:function(e){
    var time = React.findDOMNode(this.refs.time).value;

    // var timeParts = date.split('~');
    if (/\d+:\d+~\d+:\d+/.test(time)) {
      this.setState({"timeIllegal":false});
    }
    else{
      this.setState({"timeIllegal":true});
    }
  },

  render: function(){
    var programme = this.props.programme;
    programme={
      roomId: ''
    }

    console.log(programme)
    var dateVaildateStyle = this.state.dateIllegal?{backgroundColor:"red",color:"white"}:{}
    var timeVaildateStyle = this.state.timeIllegal?{backgroundColor:"red",color:"white"}:{}

    // from user input
    return (
      <li>
        <RoomMetaList programme={programme} />
        <input ref='date' size='5' onChange={this.handleDateChange} style={dateVaildateStyle}/>
        <input ref='time' size='12' onChange={this.handleTimeChange} style={timeVaildateStyle}/>
        <input ref='title' size='48' />
        <input ref='members' size='24' />
        <button ref="btnAdd" onClick={this.handleAddProgramme} disabled={this.state.dateIllegal || this.state.timeIllegal}>add</button>
      </li>
    );
  }
})

module.exports = ProgrammeNewListItem;
