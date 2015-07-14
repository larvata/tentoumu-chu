var React = require('react')
var ReactPropTypes = React.PropTypes;
var RoomMetaList = require('./RoomMetaList.jsx');

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var programmeInputCheckMixin = require('../../mixins/programmeInputCheck');

var ProgrammeListItem = React.createClass({

   mixins: [FluxibleMixin,programmeInputCheckMixin],

  propTypes: {
    programme: React.PropTypes.object
  },

  render: function(){
    var programme = this.state.programme;

    var readOnlyItem=(programme.type === 'programme-auto')?true:"";
    readOnlyItem="";




    // item from rss feed parse shouldn't be edit
    return (
      <li>
        <RoomMetaList programme={this.state.programme}/>
        <input ref='date' size='5' readOnly={readOnlyItem} onChange={this.setDateState} value={this.state.dateText} style={this.getDateClass()}/>
        <input ref='time' size='12' readOnly={readOnlyItem} onChange={this.setTimeState} value={this.state.timeText} style={this.getTimeClass()} />
      </li>
    );

  }
})

        // <input ref='title' readOnly={readOnlyItem} size='48' onChange={this.handleProgrammeUpdate} value={programme.title} />
        // <input ret='members' readOnly={readOnlyItem} size='24' onChange={this.handleProgrammeUpdate} value={programme.members} />

module.exports = ProgrammeListItem;


 /*  */