Fluxible = require('fluxible')
require('node-jsx').install({extension:'.jsx'})

app = new Fluxible({
  component: require('../components/Routes.jsx')
})

app.registerStore(require('../stores/ApplicationStore'))

module.exports = app