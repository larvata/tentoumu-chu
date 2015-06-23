Fluxible = require('fluxible')

fetchrPlugin = require('fluxible-plugin-fetchr')

app = new Fluxible()

# TODO api path load from config
app.plug(fetchrPlugin({xhrPath: '/api'}))

app.registerStore(require('../stores/ApplicationStore'))
app.registerStore(require('../stores/ScheduleStore'))

module.exports = app
