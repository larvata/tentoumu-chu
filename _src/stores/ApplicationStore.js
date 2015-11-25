import {createStore} from 'fluxible/addons';

export default createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'CHANGE_ROUTE': 'handleNavigate'
  },
  initialize: function() {
    return this.currentRoute = null;
  },
  handleNavigate: function(route) {
    if (this.currentRoute && route.path === this.currentRoute.path) {
      return;
    }
    this.currentRoute = route;
    return this.emitChange();
  },
  getState: function() {
    return {
      route: this.currentRoute
    };
  },
  dehydrate: function() {
    return this.getState();
  },
  redydrate: function(state) {
    this.currentRoute = state.route;
  }

});
