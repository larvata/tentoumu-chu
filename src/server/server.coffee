express = require 'express'
apiRouter = require './apiRouter'
React = require 'react'
Router = require 'react-router'
navigateAction = require '../actions/navigate'
showSchedule =require '../actions/showSchedule'
app = require './app'
serialize = require 'serialize-javascript'
debug = require('debug')('Example')
# config = require '../configs/configLoader'
FluxibleComponent = require 'fluxible/addons/FluxibleComponent'
cookieParser = require('cookie-parser')
csrf = require('csurf')
HtmlComponent = React.createFactory(require('../components/Html.jsx'))

miki = require '../services/miki'


class Server
  constructor: () ->

  start: ()->
    server = express()

    # server.use(csrf({cookie: true}))
    # server.use(cookieParser())

    # serve static files
    staticPath= __dirname+"/../../build"
    server.use('/build', express.static(staticPath))

    # serve api
    server.use('/api',apiRouter)



    fetchrPlugin = app.getPlugin('FetchrPlugin')
    fetchrPlugin.registerService(require('../services/schedule'))
    server.use(fetchrPlugin.getXhrPath(),fetchrPlugin.getMiddleware)

    # serve main
    server.use (req, res, next) ->
      context = app.createContext({
        req:req
        xhrContext:{
          # _csrf:req.csrfToken()
        }
      })
      # bind context to miki
      # miki.context=context
      # console.log "bind miki with context"
      # console.log context

      debug 'Executing navigate action'
      Router.run app.getComponent(), req.path, (Handler, state) ->
        # console.log("handler:")
        # console.log Handler

        context.executeAction navigateAction, state, (err)->
          if err
            if err.statusCode and err.statusCode is 404
              next()
            else
              next(err)
            return

          # console.log "navigate state"
          # console.log state


          if state.path is '/manage'
            context.executeAction showSchedule,{},(err)->
              console.log "show executeAction done"

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


    server.listen miki.config.port
    console.log 'Listening on port ' + miki.config.port


module.exports= new Server()
