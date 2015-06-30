#!/usr/bin/env node

var http = require('http');
var Promise = require('bluebird');
var sprintf = require("sprintf-js").sprintf;
var fetch = require('node-fetch');
fetch.Promise = Promise;

var base_url = "http://finance.google.com/finance/info?client=ig&q=";
var symbols = process.argv[process.argv.length - 1];
if (process.argv.length < 3) {
  console.log('Usage: gticker [symbol]');
  process.exit(1);
}

function printResult(stocks) {
  var toPrint = stocks.reduce(function(prev, stock) {
    if (stock.el && stock.ecp) {  // real-time
      return prev + sprintf("%s %.2f [%.2f%%] ", stock.t, stock.el, stock.ecp);
    } else { // pre-market, after-hours
      return prev + sprintf("%s %.2f (%.2f%%) ", stock.t, stock.l, stock.cp);
    }
  }, '');
  console.log(toPrint);
}
fetch(base_url + symbols)
  .then(function(res) {
    return res.text()
  })
  .then(function(body) {
    return body.replace(/^\s*\/\/\s*/g, '');
  })
  .then(JSON.parse)
  .then(printResult);

