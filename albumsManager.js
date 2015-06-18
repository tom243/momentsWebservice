var albumsCollection = require("./getAlbums");


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

AlbumsManager.prototype.setAlbums = function(albumsList){
	this.albums = albumsList;
}

exports.getAlbumsManager = function(){
	var albumsManager = new AlbumsManager();
	return albumsManager;
};

