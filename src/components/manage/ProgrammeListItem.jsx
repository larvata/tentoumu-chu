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
          <input readOnly value={programme.month +"/" + programme.day}/>
          <input readOnly value={programme.start + "~" + programme.end} />
          <input readOnly value={programme.title}/>
        </li>
      );
    }
    else if (programme === 'programme-custom'){
      // from user input
      return (
        <li>
          <input value={programme.month +"/" + programme.day}/>
          <input value={programme.start + "~" + programme.end} />
          <input value={programme.title}/>
        </li>
      );
    }


  }
})

module.exports = ProgrammeListItem;
