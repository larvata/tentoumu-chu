var React = require('react');

var DemoView = require('./DemoView.jsx');
var ButtonList = require('./ButtonList.jsx');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var {loadDemoView} = require('../../actions/___demoView')
// var fetchSchedule = require('../../actions/fetchSchedule')
// var initManage = require('../../actions/initManage');

var Main = React.createClass({

  mixins: [FluxibleMixin],
  
  statics:{
    fetchData:function(context,params,query,done){
      // context.executeAction(initManage,{},done)
      console.log("fetchData in DemoView")

      context.executeAction(loadDemoView,params,done)
    }
  }, 


  contextTypes: {
    executeAction: React.PropTypes.func.isRequired
  },

  render: function(){



    return (
      <div>


        <div>
          <div>
            <ButtonList />
            

          </div>
        </div>
      </div>


    )

  }
});


module.exports= Main;
