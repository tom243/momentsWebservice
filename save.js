var mongoose = require('mongoose');

exports.insertAlbumToDB = function(albumName, date, persons, pic,creationAddress, momentEvent, callback){

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemaAlbum').schema_name;
	var album = mongoose.model('schemaAlbum',schemaAlbum);

	mongoose.connection.once('open',function(){
		var singleAlbum = new album({
			album_name: null,
			date: null,
			persons: null,
			pic: null,
			creation_address:null,
			moment_event : null
		});

		singleAlbum["album_name"] = albumName;
		singleAlbum["date"] = date;
		singleAlbum["persons"] = persons;
		singleAlbum["pic"] = pic;
		singleAlbum["creation_address"] = creationAddress;
		singleAlbum["moment_event"] = momentEvent;

		singleAlbum.save(function(err, album){
			console.log("saved: " + album);
			mongoose.disconnect();
			callback(album);
		});

	});

}