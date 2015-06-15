var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Redirect = require('react-router').Redirect;
var Application = require('./Application.jsx');
var Index = require('./Index.jsx');
var Manage = require('./manage/Main.jsx');
var Headless = require('./Headless.jsx');

var routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="manage" handler={Manage}/>
    <Route name="headless" handler={Headless}/>
    <Redirect from="hehe" to="manage?userid=:userId" params={{userId:'larvata'}}/>
    <DefaultRoute name="index" handler={Index}/>
  </Route>
);

module.exports = routes;
