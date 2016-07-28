var _ = require('underscore');
var request = require('request');
var FB = require('fb');
var fs = require('fs');

var my_token = "token";

FB.setAccessToken(my_token);
var urls = [];
var count = 1;
function downloadLoop(urls) {
    var j = 1;
            for(var i = 0;i<urls.length;i++){
                request(urls[i]).pipe(fs.createWriteStream('img/'+(i+1)+'.jpg')).on('finish', function(response) {         
                    console.log("Download Completed : "+(j++)+'/'+i);
                    });
                
            }
}

function download(next) {
        FB.api(next, 'get' , function (resp) {
            if(!resp || resp.error) {
                        console.log(!resp ? 'error occurred' : resp.error);
                        return;
                }
           

            // console.log(count++);

             for (var i = 0; i < resp.data.length; i++) {
                urls.push(resp.data[i].images[0].source);                           
            }
            console.log(urls.length);
            if(resp.paging && resp.paging.next) {

             download(resp.paging.next);
            
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
       
        var data = _.findWhere(res.data, {name:"Mobile Uploads"});
        var nextPage = '/'+data.id+'/photos';

        //for number of total photos

        // FB.api('/'+data.id, {fields: 'count'}, function (response){
        //     console.log(response);
        // });

        //for download
        download(nextPage);
    });



