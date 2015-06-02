Nishino = require './libs/miki'
Kojima = require './libs/kojimako'
Okada = require './libs/naachan'
Tashima = require './libs/meru'

CSON = require 'cson'
config = CSON.load('./tentoumu-chu.cson')
# config = require './tentoumu-chu.json'

# storage api
miki = new Nishino(config)
miki.warmup()


# main server
mako = new Kojima(miki)
mako.startServer()

# room data fetch task
# naachan = new Okada(miki)
# naachan.startMonitor()

# programme grabber
meru = new Tashima(miki)
meru.startMonitor()
