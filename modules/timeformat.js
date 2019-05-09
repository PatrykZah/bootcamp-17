function timeformat(sec){
	var date = new Date(null)
	date.setSeconds( sec )
	var str = date.toISOString().substr(11, 8);
	if(sec>=60*60*24){ //if more than day
		return (sec/60/60/24).toFixed(0) + ':' + str
	}else{
		return str
	}
}

exports.print = timeformat;