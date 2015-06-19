var React = require('react')
var ReactPropTypes = React.PropTypes;
var addProgramme = require('../../actions/addProgramme')

var ProgrammeNewListItem = React.createClass({

  propTypes: {
    programme: React.PropTypes.object
  },

  handleAddProgramme:function(e){
    this.context.executeAction(addProgramme,{title:"new programme"})
    e.target.value = ''

  },

  render: function(){
    var programme = this.props.programme;

    // from user input
    return (
      <li>
        <input size='5' />
        <input size='12' />
        <input size='48' />
        <input size='24' />
        <button onClick={this.handleAddProgramme}>add</button>
      </li>
    );


  }
})

module.exports = ProgrammeNewListItem;
