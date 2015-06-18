var mongoose = require('mongoose');

exports.getAllAlbums = function(callback){

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemaAlbum').schema_name;
 	mongoose.model('schemaAlbum',schemaAlbum);

	mongoose.connection.once('open',function(){
		var albums = this.model('schemaAlbum');
		var query = albums.find();
		query.exec(function(err,albumsCollection){
				console.log("IM in callback that returns the albums collections\n");
				callback(albumsCollection);
				mongoose.disconnect();
			});
	});

}



