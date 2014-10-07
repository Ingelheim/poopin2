var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var http = require('http').Server(app);
var redis = require("redis");
var _ = require("lodash");
var client = redis.createClient();
var port = Number(process.env.PORT || 8000);

app.use(compression());
app.use(bodyParser.json());

app.listen(port, function () {
  console.log("Listening on " + port);
});


// ADD A UID
// --> client.sadd('collectionName', 'uID', callback)
app.post('/poopin', function (req, res) {
//  console.log(req);
  var uid = req.body.uid;
  var continent = req.body.continent;
  console.log('adding',uid, continent);

  client.sadd(continent, uid, function(err, reply){
    res.send('added '+uid+' to '+continent);
  });
});


// REMOVE UID
// --> client.srem('collectionName', 'uID', callback)
app.delete('/poopin/:continent/:uid', function (req, res) {
  var uid = req.params.uid;
  var continent = req.params.continent;
  console.log('deleting',uid, continent);

  client.srem(continent, uid, function(err, reply){
    res.send('removed '+uid+' to '+continent);
  });
});


// GET COUNT
// --> client.scard('collectionName', callback)
app.get('/liveStats', function (req, res) {
  var response = {};

  function setResponse(collection) {
    client.scard(collection, function (err, reply) {
      response[collection] = reply;
    });
  }

  client.multi()
    .scard("EUROPE", setResponse("EUROPE"))
    .scard("NORTH AMERICA", setResponse("NORTH AMERICA"))
    .scard("SOUTH AMERICA", setResponse("SOUTH AMERICA"))
    .scard("AFRICA", setResponse("AFRICA"))
    .scard("ASIA", setResponse("ASIA"))
    .scard("AUSTRALIA", setResponse("AUSTRALIA"))
    .exec(function (err, replies) {
//      console.log(response);
      res.json(response);
    });
});


