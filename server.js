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

http.createServer(app).listen(app.get('port'), function(){
  console.log("RabbitMQ + Node.js app running on AppFog!");
});

app.connectionStatus = 'No server connection';
app.exchangeStatus = 'No exchange established';
app.queueStatus = 'No queue established';

app.get('/', function(req, res){
  res.render('index.jade',
    {
      title: 'Welcome to RabbitMQ and Node/Express on AppFog',
      connectionStatus: app.connectionStatus,
      exchangeStatus: app.exchangeStatus,
      queueStatus: app.queueStatus
    });
});

app.post('/start-server', function(req, res){
  
  app.rabbitMqConnection = amqp.createConnection({ host: 'localhost' });
  // https://github.com/lucperkins/af-rabbitmq-example/blob/master/app.js
  // app.rabbitMqConnection = amqp.createConnection({ url: connectionUrl() });

  app.rabbitMqConnection.on('ready', function(){
    app.connectionStatus = 'Connected!';
    res.redirect('/');
  });
});

app.post('/new-exchange', function(req, res){
  app.e = app.rabbitMqConnection.exchange('test-exchange');
  app.exchangeStatus = 'An exchange has been established!';
  res.redirect('/');
});

app.post('/new-queue', function(req, res){
  app.q = app.rabbitMqConnection.queue('test-queue');
  app.queueStatus = 'The queue is ready for use!';
  
  res.redirect('/');
});

app.get('/message-service', function(req, res){
  app.q.bind(app.e, '#');
  res.render('message-service.jade',
    {
      title: 'Welcome to the messaging service',
      sentMessage: ''
    });
});

app.post('/newMessage', function(req, res){
  var newMessage = req.body.newMessage;
  console.log('newMessage: ' + newMessage);
  app.e.publish('routingKey', { message: newMessage });

  app.q.subscribe(function(msg){
  res.render('message-service.jade',
    {
      title: 'You\'ve got mail!',
      sentMessage: msg.message
    });
  });
});