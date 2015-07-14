var search = require('./search');
var fs = require('fs');
var moment = require('moment');


 var MongoClient = require('mongodb').MongoClient;
 var url = 'mongodb://localhost:27017/stayzilla';

 MongoClient.connect(url, function  (err, db) {
 	if(err) {
 		console.log(err)
 		throw new Error(err)
 	} 

 	start(db);
 })

function start (db) {
	console.log("Started", moment().format())
	fs.readdir('/media/akash/343A718D3A714CBC/data/data', function  (err, files) {
	// body...
	console.log(files.length)



	files.forEach(function (file) {
			search('/media/akash/343A718D3A714CBC/data/data/' + file, db, files.length, function  () {
			// body...
			console.log("Never called");
		})
	})



})
}



