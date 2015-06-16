var React = require('react');

var PreviewPanel = require('./PreviewPanel.jsx')
var Toolbar = require('./Toolbar.jsx')
var ProgrammeList = require('./ProgrammeList.jsx')

module.exports = React.createClass({

  render: function(){
    return (
      <div>
        <div>
          <Toolbar />
        </div>

        <div>
          <div>
            <ProgrammeList />
          </div>
          <div>
            <PreviewPanel />
          </div>
        </div>
      </div>


    )


  }
});
