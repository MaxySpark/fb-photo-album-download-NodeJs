var _ = require('underscore');
var request = require('request');
var FB = require('fb');
var fs = require('fs');

var my_token = "Here Goes The Graph Api Explorer token";

FB.setAccessToken(mt_token);
var urls = [];

FB.api('/me/albums','get',  function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  var data = _.findWhere(res.data, {name:"Mobile Uploads"});
  FB.api('/'+data.id+'/photos', 'get', (resp) => {
       if(!resp || resp.error) {
   console.log(!resp ? 'error occurred' : resp.error);
   return;
  }
resp.data.forEach(function(element) {
    urls.push(element.source);
});

for(var i = 0;i<urls.length;i++){
    request(urls[i]).pipe(fs.createWriteStream('img/'+i+'.jpg'));
    console.log("Downloaded : "+i+'.jpg');
}
  
  });
});
