var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var assetsPath = path.resolve(__dirname, '../assets/dist');
var projectBasePath = path.resolve(__dirname, '..');
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var WEBSITE_HOST = 'www.timeface.cn';
try{
  var appConfig =  require('../app.json');
  WEBSITE_HOST = appConfig.apps[0].env.WEBSITE_HOST || 'www.timeface.cn';
}catch(err){
  console.log('读取app.json异常');
}

var vendor = [
  'react',
  'react-addons-update',
  'react-dom',
  'react-mixin',
  'redux',
  'react-redux',
  'redux-thunk',
  'history',
  'superagent',
  'moment',
  'url-pattern',
  'url-parse',
  'q',
  'lodash',
  'local-storage',
  'cookies-js',
  'babel-polyfill'
];

var config = {
  context: projectBasePath,
  entry: {
    commons: vendor
  },
  output: {
    filename: '[name]-[hash:6].js',
    chunkFilename: '[name]-[chunkhash:6].js',
    path: assetsPath,
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: [
          'react',
          'es2015',
          'stage-0'
        ],
        compact:true
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss')
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&mimetype=image/svg+xml"
    }, {
      test: /\.(jpeg|jpg|png|gif)$/,
      loader: 'url-loader?limit=10240'
    }],
    noParse:[
      'react',
      'react-dom'
    ]
  },
  resolve: {
    modulesDirectories: [
      'assets',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx'],
    alias:{}
  },
  externals: {
    'jquery':'$'
  },
  plugins: [
    // new CleanPlugin([assetsPath], { root: path.resolve(__dirname, '..') }),
    /*new webpack.ProvidePlugin({
     React: "React",
     react: "React",
     "window.react": "React",
     "window.React": "React",
     ReactDOM: "ReactDOM",
     "window.ReactDOM": "ReactDOM"
     }),*/
    new ForceCaseSensitivityPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      WEBSITE_HOST: JSON.stringify(WEBSITE_HOST)
    }),
    new ExtractTextPlugin("[name]-[chunkhash:6].css", {allChunks: true}),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/, /react/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: "[name]-[hash:6].js",
      minChunks: Infinity
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        compress: {
          drop_debugger: true,
          drop_console: true,
          warnings: false
        }
      }
    }),
    webpackIsomorphicToolsPlugin
  ]
};

module.exports = config;