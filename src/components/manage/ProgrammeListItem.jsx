var React = require('react')
var ReactPropTypes = React.PropTypes;

var ProgrammeListItem = React.createClass({

  propTypes: {
    programme: React.PropTypes.object
  },

  render: function(){
    var programme = this.props.programme;

    if (programme.type === 'programme') {
      // from rss feed parse shouldn't be edit
      return (
        <li>
          <input readOnly size='5' value={programme.month +"/" + programme.day}/>
          <input readOnly size='12' value={programme.start + "~" + programme.end} />
          <input readOnly size='48' value={programme.title} />
          <input readOnly size='24' value={programme.members} />
        </li>
      );
    }
    else if (programme === 'programme-custom'){
      // from user input
      return (
        <li>
          <input size='5' value={programme.month +"/" + programme.day}/>
          <input size='12' value={programme.start + "~" + programme.end} />
          <input size='48' value={programme.title} />
          <input size='24' value={programme.members} />
        </li>
      );
    }


  }
})

module.exports = ProgrammeListItem;
