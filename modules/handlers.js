var fs = require('fs');
var formidable = require('formidable');

var dir = "."

exports.upload = function(request, response) {
	console.log('start upload')
	var form = new formidable.IncomingForm();
	//form.keepExtensions = true;
	form.parse(request, function(error, fields, files) {
			fs.renameSync(files.upload.path, './upload_image.png');
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("received image:<br/>");
			response.write(`<img src='/upload_image.png' />`);
			response.end();
	});
}

exports.response = function(request, response){
	//response.setHeader("Content-Type", "text/html; charset=utf-8");
	//var arr = request.url.split("/")
	
	if (request.method === 'GET') {
		fs.readFile(dir+request.url, function(err, data) {
			var status = err ? 'error' : 'ok'
			console.log("request:",request.url,status)

			if(status==="ok"){
				response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
				response.write(data,'binary');
				response.end(null,'binary');
			}else{
				//response.writeHead(300, {"Content-Type": "text/html; charset=utf-8","Location": "../error.html"});
				//response.end();
				fs.readFile(dir+'/error.html', function(err, data) {
					response.statusCode = 404;
					response.write(data,'binary');
					response.end(null,'binary');
				});
			}
		});
	}else{
		response.end(500);
	}
}
