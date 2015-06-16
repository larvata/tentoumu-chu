Fluxible = require('fluxible')
require('node-jsx').install({extension:'.jsx'})
fetchrPlugin = require('fluxible-plugin-fetchr')

app = new Fluxible({
  component: require('../components/Routes.jsx')
})

app.plug(fetchrPlugin({
  xhrPath: '/api'
}))

app.registerStore(require('../stores/ApplicationStore'))
app.registerStore(require('../stores/ScheduleStore'))

module.exports = app
