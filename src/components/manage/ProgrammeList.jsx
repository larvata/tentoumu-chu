var React = require('react');
var ScheduleStore = require('../../stores/ScheduleStore')
var connectToStores = require('fluxible/addons/connectToStores');
var ProgrammeListItem = require('./ProgrammeListItem.jsx')

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

function getProgrammeListItem(programme){
  return (
    <ProgrammeListItem
      key={programme.key}
      programme={programme}/>
    );
};


var ProgrammeList = React.createClass({
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
