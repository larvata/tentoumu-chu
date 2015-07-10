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
// import showSchedule from '../actions/showSchedule';
import routes from '../components/Routes.jsx';
import fetchData from '../utils/fetchData';

// fluxible app
import app from './app';

import miki from '../assistance/miki';
import Tashima from '../assistance/meru';

const meru = new Tashima(miki);
meru.startService();


function renderApp(context,Handler,cb)
{
  const dehydratedState = `window.App=${serialize(app.dehydrate(context))};`;
  const Component = React.createElement(Handler);
  const appMarkup = React.renderToString(
    React.createElement(
      FluxibleComponent,
      {context: context.getComponentContext()},
      Component
      )
    );
  
  const html = React.renderToStaticMarkup(HtmlComponent({
    state: dehydratedState,
    markup: appMarkup
  }));

  cb(null, html);
}




// TODO fix bug: cb() not exists in context

// main part of serve config
const server = express();
server.use(bodyParser.json());

// serve static files
const staticPath= __dirname+"/../../build";
server.use('/build', express.static(staticPath));

// setup data service
const fetchrPlugin = app.getPlugin('FetchrPlugin');
fetchrPlugin.registerService(require('../services/schedule'));
fetchrPlugin.registerService(require('../services/roomMeta'));
server.use(fetchrPlugin.getXhrPath(),fetchrPlugin.getMiddleware());

server.use((req, res, next) =>
{
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
      if (err) {
        return cb(err);
      }

      renderApp(context,Handler,(err,html)=>
      {
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

