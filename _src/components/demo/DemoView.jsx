var React = require('react');
var DemoViewStore = require('../../stores/___DemoViewStore');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var connectToStores = require('fluxible/addons/connectToStores');

var DemoView = React.createClass({



  render: function(){

    console.log("view--------");
    console.log(this.props.view)
    return (
        <span>{this.props.view.content}</span>
    );

  }
})


module.exports = DemoView;

module.exports = connectToStores(
  DemoView,
  [DemoViewStore],
  {
    DemoViewStore: function(store){
      return{
        view: store.getView()
      }
    }
  }
)
