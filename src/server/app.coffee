Fluxible = require('fluxible')

fetchrPlugin = require('fluxible-plugin-fetchr')

app = new Fluxible()

app.plug(fetchrPlugin({xhrPath: '/api'}))

app.registerStore(require('../stores/ApplicationStore'))
app.registerStore(require('../stores/ScheduleStore'))

module.exports = app
