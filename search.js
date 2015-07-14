var fs = require('fs');
var pathLib = require('path');
var csv = require('fast-csv');
var _ = require('lodash');
var moment = require('moment')

var k = 0;
var till;

function search (path, db, cow, hub, callback) {
	till = cow;
	//Set up db
	if(path) {
		fs.readdir(path, function (err, files) {
			if(err) {
				//console.log('Cannot access path', path);
			}

			else {

				for (var index = 0; index < files.length; index++) {
					var element = files[index];
					var pathElement = path + '/' + element;
					try {
						var stats = fs.lstatSync(pathElement);
					}catch(err) {
						return;
					}
					if(stats.isDirectory()){
						//Its a directory. Search Further
						search(pathElement,db, till,hub, function (){});

					}

					else if (stats.isFile()) {
						//Its a file
						//console.log('Path Element is' , pathElement)
						//console.log('HAHA',pathElement)
						var fileExtensions = pathLib.extname(pathElement);

						if(fileExtensions == '.json') {
							writeData(pathElement, db, hub);

						}
					}

				}
			}
		});
	}
}

var bulk = [];

function writeData (pathElement, db, hub) {


	var content = fs.readFileSync(pathElement);
    var data = {};
    try {
        var inJson = JSON.parse(content);
    }
    catch(e) {
        console.log(content);
        console.log(typeof pathElement);
        throw new Error(e);
    }
    var paths = pathElement.split([pathLib.sep]);

    data.hid = paths.slice(-2)[0];
    data.type = pathLib.basename(pathElement, '.json').substr(11);

    inJson.forEach(function  (place) {
        data.lat = place.geometry.location.lat;
        data.lng = place.geometry.location.lng;
        data.name = place.name;
        data.place_id = place.place_id;


        /*bulk.push (data);

        if(bulk.length == 1000) {
        	console.log(k);

	        db.collection('location').insertMany(bulk, function  (err, res) {
	        	console.log('E',err, res)
	        	k++;
	        	db.close();

	        	if(k == till) {
	        		console.log("All done", moment().format());
	        	}
	        })

	        bulk = [];
   		 }*/

   		 hub.send(data);


      /*  csv.writeToString([
            data
            ], {
                headers: false
            },
            function (err, d) {
                if (err) throw new Error(err)
                console.log("Writing");
                fs.appendFileSync("out.csv", d + '\n');
            });*/
    })

	;
}

module.exports = search;