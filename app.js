var express = require("express");
var querystring = require("querystring");
var https = require('https');
var app = express();

var clientID = "275496876481-an8bs3mhbk0co88l85bkgn3pr5sdvoda.apps.googleusercontent.com";
var clientSecret = "D9Effw443ZZV2fR6hiY0-hvK";
var state = "";
var discoveryDoc;

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
      console.log("End reached:\n" + body);
      discoveryDoc = JSON.parse(body);
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
  res.redirect('/');
  
  if(req.query.state == state){
    var params = {
      code: req.query.code,
      client_id: clientID,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:8888/callback',
      grant_type: 'authorization_code'
    }
    
    //HTTP POST with above params to discoveryDoc.token_endpoint
  }
});

app.listen(8888, function(){
  console.log("Server listening on port 8888...");
  
  getEndpoints();
});