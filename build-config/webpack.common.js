/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const hasNodeDepModules = require('./has-node-dep-modules');
const babelConfig = require('./babelrc.js');

const resolve = relPath => path.resolve(__dirname, relPath);

module.exports = {
  entry: {
    app: ['./index.js']
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
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      {
        test: /\.s?css$/,
        include: resolve('../src'),
        use: ExtractTextPlugin.extract({
          use: [
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
        })
      },
      {
        test: /\.m?js$/,
        include: resolve('../src'),
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      },
      {
        test: /\.m?js$/,
        include: hasNodeDepModules,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    })
  ]
};
