/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');

const resolve = relPath => path.resolve(__dirname, relPath);

module.exports = merge(commonConfig, {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devServer: {
    hot: true,
    contentBase: resolve('../build'),
    publicPath: '/',
    host: '0.0.0.0'
  }
});
