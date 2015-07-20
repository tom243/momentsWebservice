var albumsCollection = require("./dao");

/*  Constructor for the albumsManager */
function AlbumsManager() {
	this.albums = [];
	console.log("Created instance of albums manager\n");
};

/* AlbumsManager prototypes*/
AlbumsManager.prototype.getAllAlbumList = function(callback) {
	albumsCollection.getAllAlbums(function(albumsList) {
		console.log("callback with the list of albums in  getAllAlbums function\n");
		callback(albumsList);
	});
};

/* AlbumsManager prototypes*/
AlbumsManager.prototype.getAllAlbumListPerUser = function(activeUser, callback) {
	if (this.albums === undefined || this.albums.length == 0) {// verify list is exist
		albumsCollection.getAllAlbumsPerUser(activeUser, function(albumsList) {
			console.log("callback with the list of albums in  getAllAlbumListPerUser function\n");
			callback(albumsList);
			// return the  album list already filterd by active user
		});
	} else {// return albums list from the cache
		var albumsForUser = [];
		this.albums.forEach(function(album) {
			album.persons.forEach(function(person) {
				if (person == activeUser)
					albumsForUser.push(album);
			})
		})

		console.log("Albums is up to date - no need to access mongo DB\n")
		callback(albumsForUser);
	}
};

// Create new album
AlbumsManager.prototype.createAlbum = function(albumName, creatorName, persons, pic, creationAddress, momentEvent, mobileEvent, callback) {
	var date = getCurrentDate();

	albumsCollection.insertAlbumToDB(albumName, creatorName, date, persons, pic, creationAddress, momentEvent, mobileEvent, function(album) {

		console.log("in call back after the album is save in the db\n");
		callback(album);
	});
};

AlbumsManager.prototype.setAlbums = function(albumsList) {// Set new albums array
	this.albums = albumsList;
};

AlbumsManager.prototype.addAlbum = function(album) {//Add new Album to the array
	if (album != false) {
		this.albums.push(album);
	}
};

AlbumsManager.prototype.getAlbum = function(albumName) {// get specific album by album name
	for (var i in this.albums) {
		if (this.albums[i].album_name == albumName) {
			console.log(this.albums[i]);
			return this.albums[i];
		};
	};
	console.log("ERROR!! Album not found\n");
};

AlbumsManager.prototype.insertMomentToAlbum = function(input, type, albumName, creationTime, owner, latitude, longitude, callback) {
	albumsCollection.insertMomentToAlbum(input, type, albumName, creationTime, owner, latitude, longitude, function(moment) {
		callback(moment);
	});
}

AlbumsManager.prototype.addMomentToCache = function(input, type, albumName, creationTime, momentOwner, latitude, longitude) {

	this.albums.forEach(function(album) {
		if (album.album_name == albumName)
			album.moment_event.push({
				moment_input : input,
				moment_type : type,
				creation_time : creationTime,
				owner : momentOwner,
				moment_latitude : latitude,
				moment_longitude : longitude
			});
	})
}
var getCurrentDate = function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	today = dd + '/' + mm + '/' + yyyy;
	return today;
};

exports.getAlbumsManager = function() {
	var albumsManager = new AlbumsManager();
	return albumsManager;
};
