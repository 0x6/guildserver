var G_NAME = "MI";
var userData;
var app = angular.module("main", ["ngRoute"]);

app.controller('cpCtrl', function($scope){
  var url = window.location.href;
  
  if(url.indexOf("?data=") > 0){
    userData = JSON.parse(decodeBase64(url.substr(url.indexOf("?data=") + 6)));
    saveUserCookie();
  }
  
  if(!userData)
    if(!checkForCookie()){
      $scope.nocookie = "No user data present, please log in.";
      return;
    }
  
  $('#sign-in').css({display: 'none'});
  $('#log-out').css({display: 'initial'});
  $('#control-panel').css({display: 'initial'});
  $scope.email = userData.email;
});

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "home.htm"
  })
  .when("/dps", {
    templateUrl : "dps.htm"
  })
  .when("/schedule", {
    templateUrl : "schedule.htm"
  })
  .when("/control-panel", {
    templateUrl : "controlpanel.htm",
    controller: 'cpCtrl'
  });
});

var decodeBase64 = function(s) {
  var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
  var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for(i=0;i<64;i++){e[A.charAt(i)]=i;}
  for(x=0;x<L;x++){
      c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
      while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
  }
  return r;
};

var checkForCookie = function(){
  var userCookie = Cookies.get(G_NAME + '-user-cookie');
  if(userCookie){
    userData = JSON.parse(userCookie);
    return true;
  }
  return false;
};

var saveUserCookie = function(){
  Cookies.set(G_NAME + '-user-cookie', JSON.stringify(userData), {exipres: .5});
};

var clearCookie = function(){
  Cookies.remove(G_NAME + '-user-cookie');
};