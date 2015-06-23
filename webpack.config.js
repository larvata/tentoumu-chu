var path = require('path');
var webpack = require('webpack');

var config = {
  devtool: "source-map",
  entry: './src/client/client.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'client.js'
  },
  module: {
    loaders: [
      {test: /\.jsx/, loader: 'jsx-loader'}
    ]
  },
  plugins: [
    // See:
    // https://github.com/yahoo/fluxible/issues/138
    new webpack.IgnorePlugin(/vertx/)
  ]
};

module.exports = config;
