var worker = require('./worker').worker;

worker.onmessage = function  (msg) {
	console.log(msg);
}