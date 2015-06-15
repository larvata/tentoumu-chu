var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var ApplicationStore = require('../stores/ApplicationStore');
var Nav = require('./Nav.jsx');
var RouteHandler = require('react-router').RouteHandler;

module.exports = React.createClass({
  mixins: [FluxibleMixin],
  statics: {
      storeListeners: [ApplicationStore]
  },

  getInitialState: function () {
      return this.getStore(ApplicationStore).getState();
  },
  onChange: function () {
      var state = this.getStore(ApplicationStore).getState();
      this.setState(state);
  },

  render: function(){
    return (
      <div>
        <Nav />
        <RouteHandler />
      </div>
    );
  }
});
