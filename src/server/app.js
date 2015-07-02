import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';

var app = new Fluxible();
app.plug(fetchrPlugin({
  xhrPath:'/api'
}));

app.registerStore(require('../stores/ApplicationStore'));
app.registerStore(require('../stores/ScheduleStore'));

export default app;