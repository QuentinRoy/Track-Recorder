/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const hasNodeDepModules = require('./has-node-dep-modules');
const packageConfig = require('../package.json');

const resolve = relPath => path.resolve(__dirname, relPath);

module.exports = {
  entry: {
    app: ['babel-polyfill', './index.js']
  },
  output: {
    path: resolve('../build'),
    publicPath: './',
    filename: '[name].js'
  },
  context: resolve('../src'),
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.s?css$/,
        include: resolve('../src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: { path: resolve('./postcss.config.js') }
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.m?js$/,
        include: resolve('../src'),
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.m?js$/,
        include: hasNodeDepModules,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 }
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(packageConfig.version)
    })
  ]
};
