var express = require('express');
var router = express.Router();
var path = require('path');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var assetsPath = path.resolve(__dirname, '../assets/src');
var serverRender = require('../utils/serverRender');
router.get('/', (req, res, next) => {
  if (!__DEVELOPMENT__) {
    var App = require(path.join(assetsPath, 'index/index.entry.js'));
    var state = Object.assign({}, res.app.locals.initialState, res.locals.initialState);
    res.locals.body =  serverRender(App, state);
  }
  res.render('index');
});

module.exports = router;
