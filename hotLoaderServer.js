import webpack from 'webpack';
import WebPackDevServer from 'webpack-dev-server';
import config from './webpack.config';
import env from './src/configs/environment';

var hotLoaderServer = new WebPackDevServer(webpack(config),{
  contentBase: 'http://localhost:' + env.hot_server_port,
  publicPath: config.output.publicPath,
  noInfo: true,
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

hotLoaderServer.listen(env.hot_server_port,'localhost',(err,result)=>{
  if (err) {
    console.log(err);
  }
  console.log(`server on http://localhost:${env.hot_server_port}`);
  console.log("hot load server is ready.");
});

