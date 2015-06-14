var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Application = require('./Application.jsx');
var Index = require('./Index.jsx');
var Manage = require('./Manage.jsx');
var Headless = require('./Headless.jsx');

var routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="manage" handler={Manage}/>
    <Route name="headless" handler={Headless}/>
    <DefaultRoute name="index" handler={Index}/>
  </Route>
);

module.exports = routes;