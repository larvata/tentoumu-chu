createStore = require('fluxible/addons').createStore

ApplicationStore = createStore({
  storeName: 'ApplicationStore'
  handlers:
    'CHANGE_ROUTE':'handleNavigate'

  initialize: ()->
    this.currentRoute = null

  handleNavigate: (route)->
    if @currentRoute and route.path is @currentRoute.path
      return
    @currentRoute = route

    @emitChange()

  getState: ()->
    return {
      route:@currentRoute
    }

  dehydrate:()->
    @getState()

  redydrate:(state)->
    @currentRoute=state.route



})

module.exports = ApplicationStore