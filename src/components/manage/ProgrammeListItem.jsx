var React = require('react')
var ReactPropTypes = React.PropTypes;
var RoomMetaList = require('./RoomMetaList.jsx');

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var programmeInputCheckMixin = require('../../mixins/programmeInputCheck');

var programmeUpdateMixin = require('../../mixins/programmeUpdate');
var programmeChangeMixin = require('../../mixins/programmeChange');

var ProgrammeListItem = React.createClass({

   mixins: [FluxibleMixin,programmeInputCheckMixin,programmeUpdateMixin,programmeChangeMixin],

  propTypes: {
    programme: React.PropTypes.object
  },

  render: function(){
    var programme = this.state.programme;

    var readOnlyItem=(programme.type === 'programme-auto')?true:"";
    // readOnlyItem="";




    // item from rss feed parse shouldn't be edit
    return (
      <li>
        <RoomMetaList programme={this.state.programme}/>

        <input ref='date' size='5' 
        readOnly={readOnlyItem} 
        onChange={this.setDateState} 
        onBlur={this.updateProgrammeInfo.bind(null,'date')}
        value={this.state.dateText} 
        style={this.getDateClass()} />

        <input ref='time' size='12' 
        readOnly={readOnlyItem} 
        onChange={this.setTimeState} 
        onBlur={this.updateProgrammeInfo.bind(null,'time')}
        value={this.state.timeText} 
        style={this.getTimeClass()} />

        <input ref='title' size='48' 
        readOnly={readOnlyItem} 
        onChange={this.changeProgrammeInfo.bind(null,'title','title')}
        onBlur={this.updateProgrammeInfo.bind(null,'title')}
        value={programme.title} />

        <input ret='members' size='24'
        readOnly={readOnlyItem} 
        onChange={this.changeProgrammeInfo.bind(null,'members','members')} 
        onBlur={this.updateProgrammeInfo.bind(null,'members')}
        value={programme.members} />

      </li>
    );

  }
})


module.exports = ProgrammeListItem;



        /*
        



    */