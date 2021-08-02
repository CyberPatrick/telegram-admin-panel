const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractMiniCssPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

let js = fs.readdirSync('./src/js');
let css = fs.readdirSync('./src/css');
let html = fs.readdirSync('./src/views');

module.exports = {
  entry: [...js.map(file => path.resolve('./src/js', file)), ...css.map(file => path.resolve('./src/css', file))],
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.css$/, include: path.resolve(__dirname, 'src/css/'), use: [ExtractMiniCssPlugin.loader, 'css-loader'] },
      { test: /\.js$/, include: path.resolve(__dirname, 'src/js/'), use: 'babel-loader' },
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/favicon',
          to: './favicon'
        },
        {
          from: './src/img',
          to: './img'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/views/layouts/main.hbs'),
      filename: path.resolve(__dirname, 'dist/views/layouts/main.hbs'),
    }),
    ...html.filter(file => {
      if (file === 'layouts') return false;
      else return true;
    }).map(file => new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `src/views/${file}`),
      filename: path.resolve(__dirname, `dist/views/${file}`),
      inject: false,
    })),
    new ExtractMiniCssPlugin({
      filename: './css/bundle.css',
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  }
}