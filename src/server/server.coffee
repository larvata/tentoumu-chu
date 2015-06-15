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


require('node-jsx').install()

server = express()

staticPath= __dirname+"/../../build"
server.use('/build', express.static(staticPath));



# # will be removed next version
# server.use route.get('/api/list',api.getSchedule)
# server.use route.get('/api/room',api.getRoom)


# # new api
# server.use route.get("/api/#{config.apiVersion.v1}/manage/schedule",api.getManageSchedule)
# server.use route.get("/api/#{config.apiVersion.v1}/list", api.getListSchedule)


router = express.Router()

router.route('/list').get((req,res)->
  res.json({mesage:"this is api/list"})
)

server.use('/api',router)


server.use (req, res, next) ->
  context = app.createContext()
  debug 'Executing navigate action'
  Router.run app.getComponent(), req.path, (Handler, state) ->
    context.executeAction navigateAction, state, ->
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
