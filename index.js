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
  console.log('stocks', stocks);
  var toPrint = stocks.reduce(function(prev, stock) {
    // stock.el quotes in pre-market
    // stock.l quotes during the market
    var p = stock.el || stock.l; 
    return prev + sprintf("%s %.2f (%.2f%%) ", stock.t, p, stock.cp);
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

