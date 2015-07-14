require("babel/polyfill");

import React from 'react';
import app from '../server/app';

import Router from 'react-router';
// const HistoryLocation = Router.HistoryLocation;

import FluxibleComponent from 'fluxible/addons/FluxibleComponent';

const dehydratedState = window.App;
import routes from '../components/Routes.jsx';

// for chrome devtools
window.React = React;
import fetchData from '../utils/fetchData';


function renderApp(context,Handler){
  var mountNode = document.getElementById('app');
  var Component = React.createElement(Handler);
  React.render(
    React.createElement(
      FluxibleComponent,
      { context: context.getComponentContext() },
      Component
    ),
    mountNode,
    ()=>{
      // renderApp callback
      console.log('React Rendered');
      return;
    }
  );
}


console.log("try app.rehydrate");
app.rehydrate(dehydratedState,(err,context)=>{
  console.log("in app.rehydrate");
  console.log(dehydratedState);

  if(err){
    throw(err);
  }

  window.context=context;

  var firstRender = true;

  var router = Router.create({
    routes:routes,
    location: Router.HistoryLocation,
    transitionContext: context
  });

  router.run((Handler,routerState)=>{
    if(firstRender){
      console.log("frist render");
      renderApp(context,Handler);
      firstRender = false;
    }
    else{
      console.log("not first render try fetchdata");
      fetchData(context,routerState,()=>renderApp(context,Handler));
    }
  });
});



