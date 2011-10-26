var express = require('express'),
    loader = require('./lib/lfp-loader.js');

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});

loader('data/lichen.lfp');
app.listen(3000);