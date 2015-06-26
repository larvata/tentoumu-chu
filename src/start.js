require('babel/register');

import miki from './assistance/miki';
import server from './server/server';
import Tashima from './assistance/meru';
meru = new Tashima(miki);

meru.startService();

server.start();
