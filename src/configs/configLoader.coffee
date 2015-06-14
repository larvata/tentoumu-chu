CSON = require 'season'

console.log __dirname

config = CSON.readFileSync("#{__dirname}/tentoumu-chu.cson")


module.exports=

  # server port
  port: 3434

  apiVersion:
    v1:'v1'
