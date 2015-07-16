var React = require('react');
var ScheduleStore = require('../../stores/ScheduleStore')
var connectToStores = require('fluxible/addons/connectToStores');
var ProgrammeListItem = require('./ProgrammeListItem.jsx')

// var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

function getProgrammeListItem(programme){
  return (
    <ProgrammeListItem
      key={programme.key}
      programme={programme}/>
    );
};


var ProgrammeList = React.createClass({

  componentWillMount: function(){
    console.log('componentWillMount');
  },

  componentDidMount: function(){
    console.log('componentDidMount');
  },

  componentWillReceiveProps: function(nextProps){
    console.log('componentWillReceiveProps');

    return{
      schedule:nextProps.schedule
    }
  },

  shouldComponentUpdate: function(nextProps,nextState){
    console.log('shouldComponentUpdate');
    var ret= (this.props.schedule.length !== nextProps.schedule.length);
    return ret;
  },

  componentWillUpdate: function(){
    console.log('componentWillUpdate');
  },

  componentDidUpdate: function(){
    console.log('componentDidUpdate ');
  },

  componentWillUnmount: function(){
    console.log('componentWillUnmount');
  },

  render: function(){
    var programmeListItems=this.props.schedule.map(getProgrammeListItem);
    return (
      <div>
        {programmeListItems}
      </div>);
  }
});


module.exports = connectToStores(
  ProgrammeList,
  [ScheduleStore],
  {
    ScheduleStore: function(store){
      return{
        schedule: store.getSchedule()
      }
    }
  }
)
