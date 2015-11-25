import koa from 'koa';
import route from 'koa-route';
import serve from 'koa-static';
import compress from 'koa-compress';

import path from 'path';

import {rooms, schedules} from './controller';

import config from './config';

import {Tashima, Nishino} from './assistance';




// init services
var miki = new Nishino();
var meru = new Tashima(miki);

meru.startService();


// // init backend server
// var kojimako = koa();

// kojimako.use(route.get('/rooms', rooms.list));

// kojimako.use(route.get('/schedules', schedules.list));
// kojimako.use(route.post('/schedules'), schedules.modify);

// kojimako.use(serve(path.join(__dirname, 'public')));

// kojimako.use(compress());


// kojimako.listen(config.port);



