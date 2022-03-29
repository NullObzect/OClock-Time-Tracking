const path = require('path');

const config = {
  entry: {
    index: './src/index.js',
    // test: './src/test.js',
    report: ['@babel/polyfill', './src/report.js'],
    timeTracking: ['@babel/polyfill', './src/timeTracking.js'],
    holiday: ['@babel/polyfill', './src/holiday.js'],
    startData: './src/startData.js',
    leaveday: ['@babel/polyfill', './src/leaveday.js'],
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
            plugins: ['@babel/plugin-transform-async-to-generator', '@babel/plugin-transform-modules-commonjs',
            ],

          },
        },
      },
    ],
  },
};

module.exports = config;
