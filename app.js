var _ = require('underscore');
var request = require('request');
var FB = require('fb');
var fs = require('fs');

var my_token = "token";

FB.setAccessToken(my_token);
var urls = [];

FB.api('/me/albums','get',  function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  var data = _.findWhere(res.data, {name:"Mobile Uploads"});
  var nextPage = '/'+data.id+'/photos?limit=80';

  FB.api(nextPage, 'get', function (response){
      download(response);
      
  });
  console.log(urls.length);
});

function downloadLoop(urls) {
    var j = 1;
            for(var i = 0;i<urls.length;i++){
                request(urls[i]).pipe(fs.createWriteStream('img/'+i+'.jpg')).on('finish', function(response) {         
                     console.log("Download Completed : "+(j++)+'/'+i);
                    });
                
            }
}

function download(resp) {
    if(!resp || resp.error) {
                        console.log(!resp ? 'error occurred' : resp.error);
                        return;
                }
            resp.data.forEach(function(element) {
                urls.push(element.images[0].source);                           
            });
            nextPage = resp.paging.next;
             downloadLoop(urls);
            //  if(nextPage != "undefined") {

            //  FB.api(nextPage,'get',function (response) {
            //      download(resp);
            //  });
            //}
}