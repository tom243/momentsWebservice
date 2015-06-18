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
	res.send("Welcome to my albumsManager");
});


app.get('/getAllAlbums',function (req,res){
	app.set('json space',3);
	albumsManager.getAllAlbumsList(function (albumsList){
		albumsManager.setAlbums(albumsList);
		console.log(albumsList);
		res.json(albumsList);
	});
});

app.get('/createAlbum',function (req,res){
	app.set('json space',3);
	var urlPart= url.parse(req.url,true);
	var query = urlPart.query;
	console.log(query.album_name);
	query.pic = "http://cdn.searchenginejournal.com/wp-content/uploads/2013/08/photo-album-icon.gif";
	albumsManager.createAlbum(query.album_name, query.persons, 
		query.pic,query.creationAddress, query.momentEvent, function (album){
		res.json(album);
	});
});

var port =process.env.PORT || 3000;
app.use('/',express.static('./public')).listen(port);
console.log("listening on port " + port +"\n");
