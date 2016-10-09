var express = require("express");
var app = express();

var clientID = "275496876481-an8bs3mhbk0co88l85bkgn3pr5sdvoda.apps.googleusercontent.com";
var clientSecret = "D9Effw443ZZV2fR6hiY0-hvK";

app.use(express.static("public"));

app.get('/login', function(req, res){
  
});

app.listen(8888, function(){
  console.log("Server listening on port 8888...");
});