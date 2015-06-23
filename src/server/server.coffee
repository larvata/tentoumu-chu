express = require 'express'
apiRouter = require './apiRouter'
React = require 'react'
Router = require 'react-router'
navigateAction = require '../actions/navigate'
showSchedule =require '../actions/showSchedule'
require('node-jsx').install({extension:'.jsx'})
app = require './app'
serialize = require 'serialize-javascript'
debug = require('debug')('Example')
# config = require '../configs/configLoader'
FluxibleComponent = require 'fluxible/addons/FluxibleComponent'
cookieParser = require('cookie-parser')
csrf = require('csurf')
HtmlComponent = React.createFactory(require('../components/Html.jsx'))

miki = require '../services/miki'
routes = require('../components/Routes.jsx')

fetchData = require '../utils/fetchData'

renderApp= (context,Handler,cb)->
  console.log "start renderapp"
  dehydratedState = "window.App=#{serialize(app.dehydrate(context))};"
  Component = React.createElement(Handler)
  appMarkup = React.renderToString(
    React.createElement(
      FluxibleComponent,
      {context: context.getComponentContext()},
      Component
      )
    )
  html = React.renderToStaticMarkup(HtmlComponent({
    state: dehydratedState
    markup: appMarkup
  }))


  cb(null, html)


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
    # TODO load api address from config
    # server.use('/api/v1',apiRouter)



    fetchrPlugin = app.getPlugin('FetchrPlugin')
    fetchrPlugin.registerService(require('../services/schedule'))

    console.log "fetchrPlugin.getXhrPath: #{fetchrPlugin.getXhrPath()}"
    server.use(fetchrPlugin.getXhrPath(),fetchrPlugin.getMiddleware())

    # serve main

    server.use (req, res, next) =>
      context = app.createContext({
        req:req
        xhrContext:{
          # _csrf:req.csrfToken()
        }
      })



      router = Router.create(
        routes: routes
        location: req.url
        transitionContext: context
        onAbort:(redirect)->
          cb({redirect:redirect})
        onError: (err)->
          cb(err)
        )

      router.run (Handler,routerState)->
        if routerState.routes[0].name is 'not-found'
          html = React.renderToStaticMarkup(React.createElement(Handler))
          cb({notFound: true}, html)
          return

        fetchData context,routerState,(err)->
          console.log "fetchData done"

          if err
            return cb(err)




          renderApp context,Handler,(err,html)->
            console.log "render app done"

            if err && err.notFound
              console.log "notfound: #{req.url}"
              return res.status(404).send(html)

            if err && err.redirect
              return res.redirect(303,err.redirect.to)

            if err
              return next(err)

            res.send(html)




    server.listen miki.config.port
    console.log 'Listening on port ' + miki.config.port


module.exports= new Server()
