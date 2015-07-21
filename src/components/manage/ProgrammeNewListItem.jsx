var React = require('react');
var ReactPropTypes = React.PropTypes;
var {addProgramme} = require('../../actions/programme');
var ScheduleStore = require('../../stores/ScheduleStore');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var programmeInputCheckMixin = require('../../mixins/programmeInputCheck');
var programmeChangeMixin = require('../../mixins/programmeChange');

var uuid = require('node-uuid');

var RoomMetaList = require('./RoomMetaList.jsx');

function dummy(){
  var a=1;
}

var ProgrammeNewListItem = React.createClass({

  mixins: [FluxibleMixin,programmeInputCheckMixin,programmeChangeMixin],

  propTypes: {
    programme: React.PropTypes.object
  },

  getNewProgramme: function(){
    return {
      programme:{
        day: '',
        end: '',
        key: '',
        members: '',
        month: '',
        start: '',
        title: '',
        type: 'programme-custom',
        year: 2015,
        roomId: ''
      }
    }
  },

  getInitialState: function(){

    return this.getNewProgramme();
  },

  handleAddProgramme:function(e){
    var date = this.refs.date.getDOMNode().value;
    var time = this.refs.time.getDOMNode().value;
    var title = this.refs.title.getDOMNode().value;
    // var members= this.refs.members.getDOMNode().value;
    var members=''


    // TODO move programme create to addProgrammeAction
    var month = date.split('/')[0];
    var day = date.split('/')[1];
    var start = time.split('~')[0];
    var end = time.split('~')[1];
    var type="programme-custom";
    // key = type+":"+start+":"+end
    var key = "Programme:custom:"+uuid.v1();

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

    context.executeAction(addProgramme,programme,()=>{
      console.log("execute action addProgramme done");
      // React.findDOMNode(this.refs.date).value='';
      // React.findDOMNode(this.refs.time).value='';
      // React.findDOMNode(this.refs.title).value='';

      this.setState(this.getInitialState());
      this.setState(this.getInputCheckInitialState());
    })


    // React.findDOMNode(this.refs.members).value='';
  },

  render: function(){
    // from user input
    return (
      <li>
        <RoomMetaList programme={this.state.programme} />

        <input ref='date' size='5' 
        value={this.state.dateText} 
        onChange={this.setDateState} 
        style={this.getDateClass()}/>

        <input ref='time' size='12' 
        value={this.state.timeText} 
        onChange={this.setTimeState} 
        style={this.getTimeClass()}/>

        <input ref='title' size='48'
        value={this.state.programme.title} 
        onChange={this.changeProgrammeInfo.bind(null,'title','title')}
        />

        <button ref="btnAdd" onClick={this.handleAddProgramme} disabled={this.state.dateIllegal || this.state.timeIllegal}>add</button>
      </li>
    );
  }
})

module.exports = ProgrammeNewListItem;

/*
        <input ref='members' size='24' value={this.state.programme.members} />
*/