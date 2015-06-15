React = require 'react'
# debug = require 'debug'
app = require '../server/fluxibleApp'

dehydratedState = window.App

window.React = React

app.rehydrate(dehydratedState,(err,context)->
  if err
    throw err

  window.context=context
  mountNode = document.getElementById('app')

  React.render(context.createElement(),mountNode,()->
    console.log "react rendered"
  )


)
