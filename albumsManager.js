var albumsCollection = require("./getAlbums");
var saveAlbum = require('./save');

/* Constructor for the albumsManager */
function AlbumsManager () {
	this.albums =[];
	this.upToDate = false;
	console.log("Created instance of albums manager\n");
};

AlbumsManager.prototype.getAllAlbumsList = function (callback){
	if (this.albums === undefined || this.albums.length == 0  || !this.upToDate) {
		this.upToDate=true;
		albumsCollection.getAllAlbums(function (albumsList){
			console.log("callback with the list of albums in  getAllAlbums function");
			callback(albumsList);
		});
	}
	else{
		console.log("Albums is up to date - no need to access mongo DB")
		callback(this.albums);
	}
}

AlbumsManager.prototype.createAlbum = function(albumName, persons, pic,creationAddress, momentEvent,callback){
	var date  = getCurrentDate();
	this.upToDate = false; // the array we save is not up to date 
	saveAlbum.insertAlbumToDB(albumName, date, persons, pic,creationAddress, momentEvent, function (album){
		callback(album);
	});
}

AlbumsManager.prototype.setAlbums = function(albumsList){
	this.albums = albumsList;
}

var getCurrentDate =  function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	today = dd+'/'+mm+'/'+yyyy;
	return today;
}


exports.getAlbumsManager = function(){
	var albumsManager = new AlbumsManager();
	return albumsManager;
};

