const path = require('path');

const config = {
  entry: {
    index: './src/index.js',
    // test: './src/test.js',
    report: ['@babel/polyfill', './src/report.js'],
    timeTracking: ['@babel/polyfill', './src/timeTracking.js'],
    holiday: ['@babel/polyfill', './src/holiday.js'],
    startData: ['@babel/polyfill', './src/startData.js'],
    leaveday: ['@babel/polyfill', './src/leaveday.js'],
    project: ['@babel/polyfill', './src/project.js'],
    main: ['@babel/polyfill', './src/main.js'],
    users: ['@babel/polyfill', './src/users.js'],
    optionValues: ['@babel/polyfill', './src/optionValues.js'],
    profile: ['@babel/polyfill', './src/profile.js'],
    home: ['@babel/polyfill', './src/home.js'],
    timePicker: ['@babel/polyfill', './src/timePicker.js'],
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
