const path = require('path');
const webpack = require('webpack');
// const glob = require('glob');
// const entries = glob.sync('./src/**/*.*');

module.exports = {
  entry: {
    "payments": './src/payments.js',
    "payments.min": './src/payments.js',
    "stripe": "./src/providers/stripe/stripe.module.js",
    "stripe.min": "./src/providers/stripe/stripe.module.js"
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