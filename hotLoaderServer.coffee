webpack = require 'webpack'
WebPackDevServer = require 'webpack-dev-server'
config = require './webpack.config'
env = require './src/configs/environment'


new WebPackDevServer(webpack(config),{
    contentBase: 'http://localhost:'+env.hot_server_port,
    publicPath: config.output.publicPath,
    noInfo: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" }
})
.listen env.hot_server_port,'localhost',(err,result)->
    if err
        console.log err
    console.log config.output.publicPath
    console.log "hot server ready"

