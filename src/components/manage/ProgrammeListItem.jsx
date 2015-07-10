var React = require('react')
var ReactPropTypes = React.PropTypes;
var RoomMetaList = require('./RoomMetaList.jsx');

var ProgrammeListItem = React.createClass({

  propTypes: {
    programme: React.PropTypes.object
  },

  handleProgrammeUpdate:function(e){
    
  },

  render: function(){
    var programme = this.props.programme;

    var readOnlyItem=(programme.type === 'programme')?true:false;

    // item from rss feed parse shouldn't be edit
    return (
      <li>
        <RoomMetaList programme={programme}/>
        <input readOnly={readOnlyItem} size='5' onChange={this.handleProgrammeUpdate} value={programme.month +"/" + programme.day}/>
        <input readOnly={readOnlyItem} size='12' onChange={this.handleProgrammeUpdate} value={programme.start + "~" + programme.end} />
        <input readOnly={readOnlyItem} size='48' onChange={this.handleProgrammeUpdate} value={programme.title} />
        <input readOnly={readOnlyItem} size='24' onChange={this.handleProgrammeUpdate} value={programme.members} />
      </li>
    );

  }
})

module.exports = ProgrammeListItem;


 /*  */