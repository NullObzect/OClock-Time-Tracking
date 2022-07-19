const path = require('path');
const Dotenv = require('dotenv-webpack')

const config = {
  entry: {
    index: './src/js/index.js',
    // test: './src/test.js',
    report: ['@babel/polyfill', './src/js/report.js'],
    timeTracking: ['@babel/polyfill', './src/js/timeTracking.js'],
    holiday: ['@babel/polyfill', './src/js/holiday.js'],
    startData: ['@babel/polyfill', './src/js/startData.js'],
    leaveday: ['@babel/polyfill', './src/js/leaveday.js'],
    project: ['@babel/polyfill', './src/js/project.js'],
    main: ['@babel/polyfill', './src/js/main.js'],
    users: ['@babel/polyfill', './src/js/users.js'],
    optionValues: ['@babel/polyfill', './src/js/optionValues.js'],
    profile: ['@babel/polyfill', './src/js/profile.js'],
    home: ['@babel/polyfill', './src/js/home.js'],
    timePicker: ['@babel/polyfill', './src/js/timePicker.js'],
    dashboard: ['@babel/polyfill', './src/js/dashboard.js'],
    newPassword: ['@babel/polyfill', './src/js/newPassword.js'],
    searchActiveAccount: ['@babel/polyfill', './src/js/searchActiveAccount.js'],
    searchForgotUser: ['@babel/polyfill', './src/js/searchForgotUser.js'],
    flashMessage: ['@babel/polyfill', './src/js/flashMessage.js'],
    footer: ['@babel/polyfill', './src/js/footer.js'],
    manualAttendance: ['@babel/polyfill', './src/js/manualAttendance.js'],
    offDaySelectModel: ['@babel/polyfill', './src/js/offDaySelectModel.js'],
    sideNav: ['@babel/polyfill', './src/js/sideNav.js'],
    tolerenceSetModal: ['@babel/polyfill', './src/js/tolerenceSetModal.js'],
    chart: ['@babel/polyfill', './src/js/chart.js'],
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
  plugins: [new Dotenv()],
};

module.exports = config;
