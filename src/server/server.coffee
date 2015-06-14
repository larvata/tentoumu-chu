express = require 'express'
api = require './api'
React = require 'react'
Router = require 'react-router'
navigateAction = require('../actions/navigate')
app = require './fluxibleApp'
serialize = require('serialize-javascript');
debug = require('debug')('Example')
config = require '../configs/configLoader'
FluxibleComponent = require('fluxible/addons/FluxibleComponent');

HtmlComponent = React.createFactory(require('../components/Html.jsx'));

# require('node-jsx').install({extension:'.jsx'})








server = express()

# # will be removed next version
# server.use route.get('/api/list',api.getSchedule)
# server.use route.get('/api/room',api.getRoom)


# # new api
# server.use route.get("/api/#{config.apiVersion.v1}/manage/schedule",api.getManageSchedule)
# server.use route.get("/api/#{config.apiVersion.v1}/list", api.getListSchedule)

server.use (req, res, next) ->
  console.log "req"
  context = app.createContext()
  console.log "d"
  debug 'Executing navigate action'
  Router.run app.getComponent(), req.path, (Handler, state) ->
    console.log "get components"
    context.executeAction navigateAction, state, ->
      console.log "executeAction"
      debug 'Exposing context state'
      exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';'
      debug 'Rendering Application component into html'
      Component = React.createFactory(Handler)
      html = React.renderToStaticMarkup(HtmlComponent(
        state: exposed
        markup: React.renderToString(React.createElement(FluxibleComponent, { context: context.getComponentContext() }, Component()))))
      debug 'Sending markup'
      res.send html
      return
    return
  return
port = process.env.PORT or 3434
server.listen port
console.log 'Listening on port ' + port
