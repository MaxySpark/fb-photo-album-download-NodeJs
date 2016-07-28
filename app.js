var _ = require('underscore');
var request = require('request');
var FB = require('fb');
var fs = require('fs');
var argv = require('yargs').option({
    album : {
        //demand : true,
        alias:[ 'n','a'],
        description: "Name Of The Album",
        type: 'string'
    },
    friend : {
        alias: 'f',
        description: "Name Of The friend",
        type: 'string'
    }
}).help('help').alias('help','h').argv

var my_token = "token";

FB.setAccessToken(my_token);
var urls = [];
var count = 1;
var i = 0;
var j = 0;
var album_name = argv.album || "Mobile Uploads";

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
       
        var data = _.findWhere(res.data, {name:album_name});
        var nextPage = '/'+data.id+'/photos';

        FB.api(nextPage, function (response){
            for (var i = 0; i < response.data.length; i++) {
                urls.push(response.data[i].images[0].source);                           
            }
             console.log("Getting images... Total Image Found : "+ urls.length);
            download(response.paging.next);
        });        
    });