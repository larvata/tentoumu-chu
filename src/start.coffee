miki = require './services/miki'
server = require './server/server'

Tashima = require './services/meru'


# fetch schedule from rss feed
meru=new Tashima(miki)
meru.startService()


# start express server
server.start()



