var React = require('react')
var ReactPropTypes = React.PropTypes;
var addProgramme = require('../../actions/addProgramme')
var ScheduleStore = require('../../stores/ScheduleStore');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var uuid = require('node-uuid');

var ProgrammeNewListItem = React.createClass({


  mixins: [FluxibleMixin],

  propTypes: {
    programme: React.PropTypes.object
  },

  handleAddProgramme:function(e){
    var date= React.findDOMNode(this.refs.date).value;
    var time=  React.findDOMNode(this.refs.time).value;
    var title =  React.findDOMNode(this.refs.title).value;
    var members=  React.findDOMNode(this.refs.members).value;


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

  render: function(){
    var programme = this.props.programme;

    // from user input
    return (
      <li>
        <input ref='date' size='5' />
        <input ref='time' size='12' />
        <input ref='title' size='48' />
        <input ref='members' size='24' />
        <button onClick={this.handleAddProgramme}>add</button>
      </li>
    );


  }
})

module.exports = ProgrammeNewListItem;
