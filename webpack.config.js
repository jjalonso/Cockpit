
module.exports = {
  entry: {
    html: './app/index.html',
    javascript: './app/app.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.(scss|css)$/, loaders: ['style', 'css', 'sass?sourceMap']},
      { test: /\.(png|jpg)$/, loader: 'file-loader' }

    ]
  }
}
