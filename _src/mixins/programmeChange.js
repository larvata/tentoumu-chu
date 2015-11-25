export default {
  changeProgrammeInfo: function(refId,fieldId){
    var value = this.refs[refId].getDOMNode().value;
    var programme = this.state.programme;

    programme[fieldId] = value;

    this.setState({programme});
  }
};