var express = require('express'),
http = require('http'),
path = require('path'),
amqp = require('amqp');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.connectionStatus = 'No server connection';
app.exchangeStatus = 'No exchange established';
app.queueStatus = 'No queue established';

http.createServer(app).listen(app.get('port'), function(){
  console.log("RabbitMQ + Node.js app running on AppFog!");
});
