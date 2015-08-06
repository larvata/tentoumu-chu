var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Redirect = require('react-router').Redirect;
var NotFoundRoute =require('react-router').NotFoundRoute
var Application = require('./Application.jsx');
var Index = require('./Index.jsx');
var Manage = require('./manage/Main.jsx');
var Headless = require('./Headless.jsx');
var NotFound = require('./NotFoundRoute.jsx');
var provideContext = require('fluxible/addons/provideContext')


var Demo=require('./demo/Main.jsx');


var routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="manage" handler={Manage}/>
    <Route name="headless" handler={Headless}/>
    <Route name="selector" path="demo/:content" handler={Demo}/>
    <Redirect from="demo" to="demo/abc"/>

   

    <Redirect from="hehe" to="manage?userid=:userId" params={{userId:'larvata'}}/>
    <DefaultRoute name="index" handler={Index}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);

module.exports = routes;
