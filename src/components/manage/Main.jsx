var React = require('react');

var PreviewPanel = require('./PreviewPanel.jsx');
var Toolbar = require('./Toolbar.jsx');
var ProgrammeList = require('./ProgrammeList.jsx');
var ProgrammeNewListItem = require('./ProgrammeNewListItem.jsx');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
// var fetchSchedule = require('../../actions/fetchSchedule')
var initManage = require('../../actions/initManage');

var Main = React.createClass({

  contextTypes: {
    executeAction: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics:{
    fetchData:function(context,params,query,done){
      context.executeAction(initManage,{},done)
    }
  },



  render: function(){





    return (
      <div>
        <div>
          <Toolbar />
        </div>

        <div>
          <div>
            <ProgrammeList />
            <ProgrammeNewListItem/>
          </div>
          <div>
            <PreviewPanel />
          </div>
        </div>
      </div>


    )


  }
});


module.exports= Main;
