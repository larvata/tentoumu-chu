miki = require './services/miki'
Tashima = require './services/meru'

server = require './server/server'

# fetch schedule from rss feed
meru=new Tashima(miki)
meru.startService()


# start express server
server.start()



