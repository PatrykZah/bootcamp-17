process.stdout.write('use /help to get commands list\n');
process.stdin.setEncoding('utf-8')

process.stdin.on('readable', function() {
	var input = process.stdin.read()
	if(input !== null) {
		input = input.toString().trim();
		
		switch(input) {
			case '/help':
				process.stdout.write(
`Instruction list:
/node - node version
/lang - client language
/exit - exit app
`)
				break;
			case '/node':
				process.stdout.write(process.versions.node);
				break
			case '/lang':
				process.stdout.write(process.env.LANG);
				break
			case '/exit':
				process.stdout.write('instruction correct, terminate app')
				process.exit()
				break;
			default:
				process.stderr.write('404 instruction not found! use /help');
		}
		process.stderr.write('\n\n')
		process.stdin.resume()
		
	}
});



