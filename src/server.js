import express from 'express';
import graphQLHTTP from 'express-graphql';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getFarceResult } from 'found/lib/server';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import session from 'express-session';
import { ServerFetcher } from './fetcher';
import { createResolver, historyMiddlewares, render, routeConfig } from './router';
import schema from './data/schema';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import config from '../config';

const PORT = config.express.port;
const GRAPHQL_URL = config.graphql.host + ':' + config.graphql.port + config.graphql.path;

const app = express();
app.use(cookieParser());
app.use(session({
  secret: 'wayf',
  cookie: {
    httpOnly: false
  },
}));


app.use(express.static('public'));
app.all('/1/*', proxy(config.api.url));   // main API path (temporary)
app.all('/public/*', proxy(config.api.url)); // path where the widget.js is located


app.use(config.graphql.path, graphQLHTTP(request => {
  let deviceId = null;

  if (request.cookies && request.cookies.deviceId) {
    deviceId = request.cookies.deviceId;
  } else {
    deviceId = request.headers.cookie;
  }

  let adminToken = null;

  if (request.cookies && request.cookies.adminToken) {
    adminToken = "Token " + request.cookies.adminToken;
  } else {
    adminToken = request.headers.authorization;
  }

  request.session.deviceId = deviceId;
  request.session.adminToken = adminToken;

  return {
    schema: schema,
    graphiql: true,
  };
}));

const webpackConfig = {
  entry: [
    'babel-polyfill',
    './src/client',
  ],

  output: {
    path: '/',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000'
      }
    ],
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ExtractTextPlugin.extract('css-loader') },
      { test: /learn\.json$/, use: 'file-loader?name=[name].[ext]' },
      {
        test: /\.(png|jpg|svg)$/,
        use: {
          loader: 'url-loader',
        },
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
};

app.use(webpackMiddleware(webpack(webpackConfig), {
  stats: { colors: true },
}));

app.use(async (req, res) => {
  var deviceId = req.cookies.deviceId;

  var adminToken = null;

  if (req.cookies.adminToken) {
    adminToken = "Token " + req.cookies.adminToken;
  }

  const fetcher = new ServerFetcher(GRAPHQL_URL, deviceId, adminToken);

  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    historyMiddlewares,
    routeConfig,
    resolver: createResolver(fetcher),
    render
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  res.status(status).send(`
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>WAYF Cloud</title>
  <link rel="stylesheet" href="/styles/styles.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">

  <!-- Optional theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
</head>

<body>
<div id="root">${ReactDOMServer.renderToString(element)}</div>

<script>
  window.__RELAY_PAYLOADS__ = ${serialize(fetcher, { isJSON: true })};
</script>
<script src="/bundle.js"></script>
</body>

</html>
  `);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
