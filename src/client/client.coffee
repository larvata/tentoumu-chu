React = require 'react'
# debug = require 'debug'
app = require '../server/app'

Router = require('react-router')

HistoryLocation = Router.HistoryLocation
navigateAction = require('../actions/navigate')
FluxibleComponent = require 'fluxible/addons/FluxibleComponent'


dehydratedState = window.App

window.React = React


RenderApp = (context,Handler)->
  mountNode = document.getElementById('app')
  Component = React.createFactory(Handler)
  React.render React.createElement(FluxibleComponent, { context: context.getComponentContext() }, Component()), mountNode, ->
    console.log 'React Rendered'
    return



app.rehydrate dehydratedState,(err,context)->
  if err
    throw err

  window.context=context

  firstRender = true
  Router.run app.getComponent(),HistoryLocation, (Handler,state)->
    if firstRender
      console.log "frist render"
      console.log document.getElementById('app').innerHTML
      RenderApp(context,Handler)
      firstRender = false
    else
      context.executeAction navigateAction,state,()->
        RenderApp(context,Handler)



