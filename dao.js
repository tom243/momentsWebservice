var mongoose = require('mongoose');

exports.getAllAlbums = function(callback) {

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemas').album_schema;
	mongoose.model('schemaAlbum', schemaAlbum);

	mongoose.connection.once('open', function() {
		var albums = this.model('schemaAlbum');
		var query = albums.find();
		query.exec(function(err, albumsCollection) {
			console.log(albumsCollection);
			console.log("IM in callback that returns the albums collections\n");
			mongoose.disconnect();
			callback(albumsCollection);
		});
	});
}

exports.getAllAlbumsPerUser = function(activeUser, callback) {

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemas').album_schema;
	mongoose.model('schemaAlbum', schemaAlbum);

	mongoose.connection.once('open', function() {
		var albums = this.model('schemaAlbum');
		var query = albums.find({
			persons : activeUser
		});
		query.exec(function(err, albumsCollection) {
			console.log(albumsCollection);
			console.log("IM in callback that returns the albums collections\n");
			mongoose.disconnect();
			callback(albumsCollection);
		});
	});
}

exports.getAllcontacts = function(callback) {

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaContact = require('./schemas').contact_schema;
	mongoose.model('schemaContact', schemaContact);

	mongoose.connection.once('open', function() {
		var contact = this.model('schemaContact');
		var query = contact.find();
		query.exec(function(err, contactsCollection) {
			console.log("IM in callback that returns the contacts collections\n");
			mongoose.disconnect();
			callback(contactsCollection);
		});
	});
}

exports.insertAlbumToDB = function(albumName, creatorName, date, persons, pic, creationAddress, momentEvent, mobileEvent, callback) {

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemas').album_schema;
	var album = mongoose.model('schemaAlbum', schemaAlbum);
	var personsSplit = persons.split(',');

	mongoose.connection.once('open', function() {

		var singleAlbum = new album({// null instance of album
			album_name : null,
			creator_name : null,
			date : null,
			persons : [],
			pic : null,
			creation_address : null,
			moment_event : [],
			mobile_event : null
		});

		/* insert the values to the album object*/
		singleAlbum["album_name"] = albumName;
		singleAlbum["creator_name"] = creatorName;
		singleAlbum["date"] = date;
		singleAlbum.persons = personsSplit;
		singleAlbum["pic"] = pic;
		singleAlbum["mobile_event"] = mobileEvent;
		singleAlbum["creation_address"] = creationAddress;

		album.findOne({
			album_name : singleAlbum["album_name"]
		}, function(err, result) {
			if (err) {
				console.log("error findOne from DB");
				mongoose.disconnect();
				callback(false);
			}
			if (result) {
				console.log("found album with the same name!!!");
				mongoose.disconnect();
				callback(false);
			} else {
				console.log("didnt found one");
				/*save the album in db*/
				singleAlbum.save(function(err, album) {
					console.log("album saved to DB: " + album);
					mongoose.disconnect();
					callback(album);
				});
			}
		});
	});
}

exports.insertMomentToAlbum = function(input, type, albumName, creationTime, momentOwner, latitude, longitude, callback) {

	mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
	var schemaAlbum = require('./schemas').album_schema;
	mongoose.model('schemaAlbum', schemaAlbum);

	mongoose.connection.once('open', function() {
		var album = this.model('schemaAlbum');

		var query = {
			'album_name' : albumName
		};
		var doc = {
			$push : {
				'moment_event' : {
					moment_input : input,
					moment_type : type,
					creation_time : creationTime,
					owner : momentOwner,
					moment_latitude : latitude,
					moment_longitude : longitude
				}
			}
		};
		var options = {
			upsert : true
		};
		album.findOneAndUpdate(query, doc, options, function(err, results) {
			if (err) {
				mongoose.disconnect();
				console.log("didnt fount album in that name!");
				callback(false);
			} else {
				console.log("results ", results);
				mongoose.disconnect();
				callback(results);
			}
		});

	});
}