const path = require('path');
const webpack = require('webpack');
const payments = './src/payments.js';
const stripe = './src/providers/stripe/stripe.module.js';
const paypal = './src/providers/paypal/paypal.module.js';
// const glob = require('glob');
// const entries = glob.sync('./src/**/*.*');

module.exports = {
  entry: {
    stripe,
    paypal,
    payments,
    "stripe.min": stripe,
    "paypal.min": paypal,
    "payments.min": payments
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './test',
    stats: 'minimal'
  }
};