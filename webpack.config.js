const path = require('path');

const source = path.resolve(__dirname, 'src');
const config = {
  entry: {
    index: './src/index.js',
    // test: './src/test.js',
    // reports: ['./src/reports.js'],
    timeTracking: ['@babel/polyfill', './src/timeTracking.js'],

    holiday: ['@babel/polyfill', './src/holiday.js'],
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
        exclude: /node_modules/,

        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-async-to-generator', '@babel/plugin-transform-modules-commonjs'],
          },
        },
      },
    ],
  },
};

module.exports = config;
