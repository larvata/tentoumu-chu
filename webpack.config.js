
var webpack=require('webpack');
var path= require('path');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  entry:'./src/client/client.js',

  output: {
    filename: 'client.js'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader:'jsx-loader?harmony'
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
    new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react/addons'))
  ],
  status: {
    colors: true
  },
  devtool: 'source-map',
  cache: true,
  watch: true,
  keepalive: true,
};
