miki = require './assistance/miki'
server = require './server/server'

Tashima = require './assistance/meru'


# fetch schedule from rss feed
meru=new Tashima(miki)
meru.startService()


# start express server
server.start()



