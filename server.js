var express = require('express'),
http = require('http'),
path = require('path'),
amqp = require('amqp');

var app = express();

http.createServer(app).listen(app.get('port'), function(){
  console.log(“RabbitMQ + Node.js app running on AppFog!”);
});
