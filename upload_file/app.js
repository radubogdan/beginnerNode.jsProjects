var fs = require('fs');
var http = require('http');

http.createServer(function(req, res) {
  var serverFile = fs.createWriteStream("2.jpg");
  var uploadedFileBytes = req.headers['content-length'];

  var piecesUploadedSoFar = 0;

  req.pipe(res);

  req.on("data", function(chunk) {
    piecesUploadedSoFar += chunk.length; 
    var progress = (piecesUploadedSoFar / uploadedFileBytes) * 100;
    console.log("Progress: " + parseInt(progress, 10) + "%");
  });
}).listen(3000);
