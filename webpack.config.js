const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractMiniCssPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['./src/js/index.js', './src/css/styles.css'],
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.css$/, include: path.resolve(__dirname, 'src/css/'), use: [ExtractMiniCssPlugin.loader, 'css-loader'] },
      { test: /\.js$/, include: path.resolve(__dirname, 'src/js/'), use: 'babel-loader' },
      { test: /\.hbs$/, include: path.resolve(__dirname, 'src/views/'), use: 'handlebars-loader' }
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/views/login.hbs'),
      filename: path.resolve(__dirname, 'dist/views/login.hbs'),
      inject: false
    }),
    new ExtractMiniCssPlugin({
      filename: './css/bundle.css',
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  }
}