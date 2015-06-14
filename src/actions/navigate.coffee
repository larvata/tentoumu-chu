module.exports = (actionContext,payload,done)->
  actionContext.dispatch('CHANGE_ROUTE',payload)
  done()