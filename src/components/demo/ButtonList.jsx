var React = require('react');
var DemoButtonStore = require('../../stores/___DemoButtonStore')
var connectToStores = require('fluxible/addons/connectToStores');
var DemoView = require('./DemoView.jsx')

var {loadDemoView} = require('../../actions/___demoView')

var {Navigation} =require('react-router');

// var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var ButtonList = React.createClass({

  mixins: [Navigation],
  getInitialState(){
    return{
      content:this.props.buttons[0].content
    }
  },

  getButtonListItem(button){
    return (
      <button
        key={button.id}
        value={button.content}
        onClick={this.changeView}
        >{button.content}</button>
      );
  },

  changeView(e){
    var content = e.target.value
    console.log("changeView");
    // this.setState({content});
    context.executeAction(loadDemoView,{content})

    // this.context.router.dispatch('/demo/' + content,null);
    window.history.pushState({content},"",`/demo/${content}`);
    // this.context.router.silentTransitionTo('/demo/' + content)
    // this.transitionTo(`/demo/${content}`);
  },

  render(){
    var buttonListItems=this.props.buttons.map(this.getButtonListItem);

    return (
      <div>
        {buttonListItems}
        <hr />

        <DemoView content={this.state.content}/>
      </div>

      );
  }
});


module.exports = connectToStores(
  ButtonList,
  [DemoButtonStore],
  {
    DemoButtonStore: function(store){
      return{
        buttons: store.getButtons()
      }
    }
  }
)
