var _ = require('underscore');
var request = require('request');
var FB = require('fb');
var fs = require('fs');

var my_token = "token";

FB.setAccessToken(my_token);
var urls = [];
var count = 1;
var i = 0;
var j = 0;
function downloadLoop(urls) {
            for(i;i<urls.length;i++){
                request(urls[i]).pipe(fs.createWriteStream('img/'+(i+1)+'.jpg')).on('finish', function(response) {         
                    console.log("Download Completed : "+(++j)+'/'+i);
                    });
                
            }
}

function download(next) {
        request({
            url: next,
            json: true
        }, function(err, res, body) {
            if(err) throw err;
            for (var i = 0; i < body.data.length; i++) {
                urls.push(body.data[i].images[0].source);                           
            }
            console.log("getting images... Total Image : "+ urls.length);
            if(body.paging && body.paging.next) {
             download(body.paging.next);
            
        } else {
                console.log("Completed");
            }
downloadLoop(urls);
        });
}


FB.api('/me/albums','get',  function (res) {
        if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
        }
       
        var data = _.findWhere(res.data, {name:"Timeline Photos"});
        var nextPage = '/'+data.id+'/photos';

        FB.api(nextPage, function (response){
            for (var i = 0; i < response.data.length; i++) {
                urls.push(response.data[i].images[0].source);                           
            }
            download(response.paging.next);
        });        
    });