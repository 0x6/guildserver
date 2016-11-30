var express = require("express");
var querystring = require("querystring");
var https = require('https');
var request = require('request');
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert');
var app = express();

// OAUTH
//**************************
var clientID = "275496876481-an8bs3mhbk0co88l85bkgn3pr5sdvoda.apps.googleusercontent.com";
var clientSecret = "D9Effw443ZZV2fR6hiY0-hvK";
var state = "";
var discoveryDoc;

// MONGODB
var user = encodeURIComponent("igno4");
var password = encodeURIComponent("chs00pag");
var database = "guildinfo"
var authMechanism = "DEFAULT";
var authSource = "guildinfo";

// Connection URL
var dburl = f('mongodb://%s:%s@localhost:27017/%s?authMechanism=%s&authSource=%s',
  user, password, database, authMechanism, authSource);
//"mongodb://localhost:27017/guildinfo";

app.use(express.static("public"));

//Retrieve the google discovery for endpoints
function getEndpoints(){
  https.get("https://accounts.google.com/.well-known/openid-configuration", 
  function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    });
    
    res.on('end', function(){
      discoveryDoc = JSON.parse(body);
      console.log("Discovery doc received.");
    });
  });
};

//Generate a random (hopefully unique) state key
var stateChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateStateKey(){
  state = "";
  
  for(var i = 0; i < 30; i++){
    state += stateChars.charAt(Math.random() * 36);
  }
}

app.get('/login', function(req, res){
  generateStateKey();
  
  var params = {
    client_id: clientID,
    response_type: 'code',
    scope: 'openid email',
    redirect_uri: 'http://localhost:8888/callback',
    state: state
  }
  
  //Redirect to google sign in page
  res.redirect(discoveryDoc.authorization_endpoint + "?" + querystring.stringify(params));
});

app.get('/callback', function(req, res){
  //res.redirect('/');
  
  if(req.query.state == state){
    //HTTP POST with above params to discoveryDoc.token_endpoint
    request.post(discoveryDoc.token_endpoint,
    {form: {
      code: req.query.code,
      client_id: clientID,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:8888/callback',
      grant_type: 'authorization_code'
    }},
    function(error, response, body){
      if(error)
        throw error;
      
      var tokenResponse = JSON.parse(body);
      var idToken = tokenResponse.id_token;
      
      var segments = idToken.split('.');
      var payload = JSON.parse(base64urlDecode(segments[1]));
      
      res.redirect('/#/control-panel?data=' + segments[1]);
    });
  }
});

app.get('/logout', function(req, res){
  
});
    
function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
};

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}

app.listen(8888, function(){
  console.log("Server listening on port 8888...");
  getEndpoints();
  
  /*MongoClient.connect(dburl, function (err, db){
    if(err){
      console.log(err);
      return;
    }
    console.log("Connected to server.");
    var col = db.collection('users');
    
    col.deleteOne({a:1});
    
    col.find().toArray(function(err, list){
      console.log(list);
    });
    
    db.close();
  });*/
});