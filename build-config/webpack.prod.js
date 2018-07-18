/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new BabiliPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
});
