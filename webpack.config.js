const path = require('path');

const config = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'public/js/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
