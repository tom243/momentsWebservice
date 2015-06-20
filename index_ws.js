var express = require('express');
var url = require('url');
var app = express();
var manager = require('./albumsManager');

var albumsManager = manager.getAlbumsManager(); // contains instance of BookStorage

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/',function (req,res){
	res.send("Welcome to sheared moments");
});


app.get('/getAllAlbums',function (req,res){
	console.log("In getAllAlbums route\n")
	app.set('json space',3);
	albumsManager.getAllAlbumsList(function (albumsList){
		albumsManager.setAlbums(albumsList); // Set the album list to array cache
		console.log(albumsList);
		res.json(albumsList);
	});
});

app.get('/createAlbum',function (req,res){
	console.log("In createAlbum route\n")
	app.set('json space',3);
	var urlPart= url.parse(req.url,true);
	var query = urlPart.query;
	console.log("verify album name is correct, the name is :" + query.album_name + "\n"); 
	query.pic = "http://cdn.searchenginejournal.com/wp-content/uploads/2013/08/photo-album-icon.gif"; // default pic later will change
	albumsManager.createAlbum(query.album_name, query.persons, 
	query.pic,query.creation_address, query.momentEvent, function (album){
		res.json(album);
	});
});

app.get('/viewAlbum',function (req,res){
	res.json(albumsManager.getActiveAlbum());
}

var port =process.env.PORT || 3000;
app.use('/',express.static('./public')).listen(port);
console.log("listening on port " + port +"\n");
