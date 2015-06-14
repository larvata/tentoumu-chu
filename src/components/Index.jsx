'use strict';
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var Index = require('./Index.jsx');
var Manage = require('./Manage.jsx');
var FluxibleMixin = require('fluxible').Mixin;
 
var Application = React.createClass({
  mixins: [FluxibleMixin],
  getInitialState: function () {
    return this.getStore(ApplicationStore).getState();
  },
  render: function(){
    return (
      <div>
        {'home' === this.state.currentPageName ? <Index/> : <Manage/>}
      </div>
    );
  }
});
 
module.exports = Application;