React = require 'react'
# debug = require 'debug'
app = require '../server/app'

Router = require('react-router')

HistoryLocation = Router.HistoryLocation
# navigateAction = require('../actions/navigate')
FluxibleComponent = require 'fluxible/addons/FluxibleComponent'


dehydratedState = window.App
routes = require('../components/Routes.jsx')
window.React = React
fetchData = require '../utils/fetchData'

renderApp = (context,Handler)->
  mountNode = document.getElementById('app')
  Component = React.createElement(Handler)
  React.render React.createElement(
    FluxibleComponent,
    { context: context.getComponentContext() },
    Component
  ),
  mountNode,
  ->
    console.log 'React Rendered'
    return


console.log "try app.rehydrate"
app.rehydrate dehydratedState,(err,context)->
  console.log "in app.rehydrate"
  console.log dehydratedState
  if err
    throw err

  window.context=context

  firstRender = true
  # Router.run app.getComponent(),HistoryLocation, (Handler,state)->
  router = Router.create(
    routes:routes
    location: Router.HistoryLocation
    transitionContext: context)



  router.run (Handler,routerState)->
    if firstRender
      console.log "frist render"
      # console.log document.getElementById('app').innerHTML
      renderApp(context,Handler)
      firstRender = false
    else
      console.log "not first render try fetchdata"

      fetchData context,routerState,()->
        renderApp(context,Handler)
      # context.executeAction navigateAction,state,()->
        # RenderApp(context,Handler)



