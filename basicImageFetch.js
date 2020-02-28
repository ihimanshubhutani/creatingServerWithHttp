const request = require('request');
const fs = require('fs');
let body = [];

const SaveImageFromUrl = (uri, filename) => {
  request(uri)
    .on('error', (error) => console.error(error))
    .pipe(fs.createWriteStream(filename))
}

const uri = "https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/p50x50/87284588_124830725745195_9124219877853233152_n.png?_nc_cat=1&_nc_sid=dbb9e7&_nc_ohc=f9ueJWjoO3kAX-dK8WX&_nc_ht=scontent.xx&oh=638808abb38c64612b30d17c96df8628&oe=5EF45EFA";
const filename = 'local.jpg';
SaveImageFromUrl(uri, filename);
