var http = require('http');
var colors = require('colors');
var fs = require('fs');
var handlers = require('./handlers');

function start() {
	var server = http.createServer(function (request, response) {
		console.log(request.url)
		switch(request.url){
		case '/':
			response.writeHead(301, {"Location": "index.html"});
			response.end();
			break
		case '/start':
			response.writeHead(301, {"Location": "templates/start.html"});
			response.end();
			break
		case '/upload':
			handlers.upload(request, response)
			break
		default:
			handlers.response(request, response)
		}
	});
	
	server.listen(80)
	console.log("Uruchomiono serwer! na porcie 80".green);
}

	
exports.start = start;