var search = require('./search');
var fs = require('fs');
var moment = require('moment');
var rabbitHub = require('rabbitmq-nodejs-client');

var pubHub = rabbitHub.create( { task: 'pub', channel: 'myChannel' } );
var subHub = rabbitHub.create( { task: 'sub', channel: 'myChannel' } );

 var MongoClient = require('mongodb').MongoClient;
 var url = 'mongodb://localhost:27017/stayzilla';

 MongoClient.connect(url, function  (err, db) {
 	if(err) {
 		console.log(err)
 		throw new Error(err)
 	} 

 	pubHub.on('connection', function  (hub) {	
 		start(db, hub);
 	})

 	subHub.on('connection', function (hub) {
		hub.on('message', function  (msg) {
			db.collection('loc').insert(msg, function  (err, res) {
				console.log('DOne', err)
			})
		})
	})



 	pubHub.connect();
 	subHub.connect();
 })

function start (db, hub) {
	console.log("Started", moment().format())
	fs.readdir('/media/akash/343A718D3A714CBC/data/data', function  (err, files) {
	// body...
	console.log(files.length)



	files.forEach(function (file) {
			search('/media/akash/343A718D3A714CBC/data/data/' + file, db, files.length, hub,function  () {
			// body...
			console.log("Never called");
		})
	})
})
}





