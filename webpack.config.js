const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.node$/,
        loader: 'native-ext-loader'
      }
    ]
  },
  devtool: 'nosources-source-map',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  plugins: [
    new webpack.IgnorePlugin(/^electron$/)
    //new CopyWebpackPlugin([
    //  {
    //    from: './node_modules/scrypt/build/Release/scrypt.node',
    //    to: './build/Release/'
    //  }
    //])
  ]
};
