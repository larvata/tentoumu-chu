require('node-jsx').install({extension:'.jsx'});

import express from 'express';
import React from 'react';
import Router from 'react-router';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import cookieParser from'cookie-parser';
import FluxibleComponent from 'fluxible/addons/FluxibleComponent';
import serialize from 'serialize-javascript';

const HtmlComponent = React.createFactory(require('../components/Html.jsx'));
import showSchedule from '../actions/showSchedule';
import routes from '../components/Routes.jsx';
import fetchData from '../utils/fetchData';

// fluxible app
import app from './app';

import miki from '../assistance/miki';
import Tashima from '../assistance/meru';


const meru = new Tashima(miki);
console.log("meru start service");
meru.startService();


console.log("define renderApp");
function renderApp(context,Handler,cb)
{
  console.log("start renderapp");
  const dehydratedState = `window.App=${serialize(app.dehydrate(context))};`;
  const Component = React.createElement(Handler);
  const appMarkup = React.renderToString(
    React.createElement(
      FluxibleComponent,
      {context: context.getComponentContext()},
      Component
      )
    );
  console.log("server write state");
  
  const html = React.renderToStaticMarkup(HtmlComponent({
    state: dehydratedState,
    markup: appMarkup
  }));

  cb(null, html);
}


console.log("define express server");

// main part of serve config
const server = express();
server.use(bodyParser.json());

// serve static files
const staticPath= __dirname+"/../../build";
server.use('/build', express.static(staticPath));

// setup data service
const fetchrPlugin = app.getPlugin('FetchrPlugin');
fetchrPlugin.registerService(require('../services/schedule'));
server.use(fetchrPlugin.getXhrPath(),fetchrPlugin.getMiddleware());

console.log("start server use");
server.use((req, res, next) =>
{

  console.log("msg");

  const context = app.createContext({
    req:req,
    xhrContext:{
      // _csrf:req.csrfToken()
    }
  });

  const router = Router.create({
    routes: routes,
    location: req.url,
    transitionContext: context,
    onAbort:(redirect)=>cb({redirect:redirect}),
    onError: (err)=> cb(err)
  });

  router.run((Handler,routerState)=>{

    if(routerState.routes[0].name === 'not-found'){
      let html = React.renderToStaticMarkup(React.createElement(Handler));
      cb({notFound: true}, html);
      return;
    }

    fetchData(context,routerState,(err)=>
    {
      console.log("fetchData done");

      if (err) {
        return cb(err);
      }

      renderApp(context,Handler,(err,html)=>
      {
        console.log("render app done");

        if (err && err.notFound) {
          console.log(`notFound: ${req.url}`);
          return res.status(404).send(html);
        }

        if (err && err.notFound) {
          return res.redirect(302,err.redirect.to);
        }

        if (err) {
          return next(err);
        }

        res.send(html);
      });
    });
  });

});

server.listen(miki.config.port);
console.log(`Listening on port: ${miki.config.port}`);

