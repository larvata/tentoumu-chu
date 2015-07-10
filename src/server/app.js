import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';

var app = new Fluxible();
app.plug(fetchrPlugin({
  xhrPath:'/api/v1'
}));

app.registerStore(require('../stores/ApplicationStore'));
app.registerStore(require('../stores/ScheduleStore'));
app.registerStore(require('../stores/RoomMetaStore'));


export default app;