var path = require('path');
var webpack = require('webpack');
var env = require('./src/configs/environment.json');


var config = {
  
  devtool: "eval",
  cache: true,
  resolve:{
    extensions: ['','.js']
  },
  entry: [
    'webpack-dev-server/client?http://localhost:'+env.hot_server_port,
    'webpack/hot/dev-server',
    './src/client/client.js'
    ],
  output: {
    path: path.join(__dirname, '/build/'),
    filename: 'client.js',
    publicPath: 'http://localhost:'+env.hot_server_port+'/build/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot','babel-loader']
      },
      {
        test: /\.cson$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot','coffee']
      }
    ]
  },
  plugins: [
    // See:
    // https://github.com/yahoo/fluxible/issues/138
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    
  ]
};

module.exports = config;
