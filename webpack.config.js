'use strict';


// http://webpack.github.io/docs/
const webpack = require('webpack');
// https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const pkg = require('./package.json');


const ENTRY_POINT = './src/RecursiveIterator.js';
const LIBRARY_NAME = 'RecursiveIterator';


module.exports = {
  entry: {
    [pkg.name]: ENTRY_POINT,
    [pkg.name + '.min']: ENTRY_POINT
  },
  module: {
    loaders: [
      // https://github.com/babel/babel-loader
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2016']
        }
      }
    ]
  },
  devtool: "source-map",
  output: {
    path: './dist',
    libraryTarget: 'umd',
    library: LIBRARY_NAME,
    filename: "[name].js"
  },
  plugins: [
    new UglifyJSPlugin({
      // Minify only [name].min.js file
      // http://stackoverflow.com/a/34018909
      // include: /\.min\.js$/
    }),
    new webpack.BannerPlugin(
      `${pkg.name} v${pkg.version}\n` +
      `${pkg.homepage}`
    )
  ]
};
