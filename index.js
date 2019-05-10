var EventEmitter = require('events').EventEmitter;
var OSinfo = require('./modules/OSinfo');
var fs = require('fs');
var StatMode = require('stat-mode');
var colors = require('colors')
var http = require('http');

var emitter = new EventEmitter();
emitter.on('beforeCommand', function(instruction) {
	console.log('You wrote: ' + instruction + ' - trying to run command.')
});
emitter.on('afterCommand', function() {
	process.stderr.write('\nFinished command\n\n')
	process.stdin.resume()
});

process.stdout.write('use /help to get commands list\n');
process.stdin.setEncoding('utf-8')
var input = ""

process.stdin.on('readable', function() {
	input = process.stdin.read()

	if(input !== null) {
		input = input.toString().trim();
		emitter.emit('beforeCommand', input);
		input = input.split(" ")
		
		switch(input[0]) {
			case '/help':
				process.stdout.write(
`Instruction list:
/node: node version

/lang - get language
/getOSinfo - get system info
/cat - get file details of cat.jpg
/tekst - print content tekst.txt 
/tekstr <text> - overwrite tekst.txt with <text>
/teksta <text> - append tekst.txt with <text>
/dir [<file name>] - show dir,[save dir list to <file name>]
/exit - exit app
`)
				break;
			case '/node':
				process.stdout.write(process.versions.node);
				break
			case '/lang':
				process.stdout.write(process.env.LANG);
				break
			case '/getOSinfo':
				OSinfo.print()
				break
			case '/cat':
				fs.stat('./cat.jpg', function(err, stats) {
					var statMode = new StatMode(stats);
					stats.mode = statMode.toString();
					console.log(stats);
				});
				break
			case '/tekst':
				fs.readFile('./tekst.txt','utf-8', function(err, data) {
					console.log(data);
				});
				break
			case '/tekstr':
				tekst()
				break
			case '/teksta':
				teksta()
				break
			case '/dir':
				dir()
				break
			case '/exit':
				process.stdout.write('instruction correct, terminate app')
				process.exit()
				break;
			default:
				process.stderr.write('404 instruction not found! use /help');
		}
		
		emitter.emit('afterCommand');
	}
});


var server = http.createServer(function (request, response) {
	//response.setHeader("Content-Type", "text/html; charset=utf-8");
	if(request.url==="/") { request.url = "/index.html"}
	console.log(request)
	
	if (request.method === 'GET') {
		fs.readFile("."+request.url, function(err, data) {	
			if(data){
				response.write(data,'binary');
				response.end(null,'binary');
			}else{
				fs.readFile('./error.html', function(err, data) {
					response.statusCode = 404;
					response.write(data,'binary');
					response.end(null,'binary');
				});
			}
		});
	}
});

server.listen(80)
console.log('server started at port 80')


function tekst(){
fs.readFile('./tekst.txt','utf-8', function(err, data) {
		console.log('dane przed zapisem'.gray);
		console.log(data);
		fs.writeFile('./tekst.txt', input[1], function(err) {
			if (err) throw err;
			console.log('Zapisano!'.red);
			fs.readFile('./tekst.txt', 'utf-8', function(err, data) {
				console.log('Dane po zapisie'.gray)
				console.log(data);
			});
		});
	});
}

function teksta(){
fs.readFile('./tekst.txt','utf-8', function(err, data) {
		console.log('dane przed zapisem'.gray);
		console.log(data);
		fs.appendFile('./tekst.txt', '\n'+input[1], function(err) {
			if (err) throw err;
			console.log('Zapisano!'.red);
			fs.readFile('./tekst.txt', 'utf-8', function(err, data) {
				console.log('Dane po zapisie'.gray)
				console.log(data);
			});
		});
	});
}

function dir(){
	fs.readdir('.','utf-8', function(err, data) {
		console.log('dir'.gray);
		console.log(data);
		if(typeof input[1] === 'string'){
			fs.writeFile('./'+input[1], data, function(err) {
				console.log('Zapisano!'.red,input[1]);
			})
		}
	});
}


