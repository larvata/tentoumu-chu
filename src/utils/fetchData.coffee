_ = require 'underscore'

# run router fetchData() parallel
parallels= (dataRouters,context,routerState,cb)->
  count = dataRouters.length

  # todo handle exception
  # call cb(err) on function goes wrong
  for router in dataRouters
    console.log "router:"
    console.log router
    router.handler.fetchData context,routerState.params,routerState.query,(err)->
      console.log "func done."
      if --count
        console.log "task last: #{count}"
      else
        console.log "all done. call callback"
        cb()

fetchData = (context,routerState,cb)->
  dataRouters= _.filter routerState.routes,(route)->
    return route.handler.fetchData

  if dataRouters.length is 0
    cb()

  parallels(dataRouters,context,routerState,cb)


module.exports= fetchData
