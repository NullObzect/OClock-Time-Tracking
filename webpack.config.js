const path = require('path');

const config = {
  entry: {
    index: './src/index.js',
    timeTracking: ['@babel/polyfill', './src/timeTracking.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public/js/'),
    filename: '[name].js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

module.exports = config;
