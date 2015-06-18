var express = require('express');
var url = require('url');
var app = express();
//var saveAlbum = require('./save');
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
	console.log("Im in WS out");
	app.set('json space',3);
	albumsManager.getAllAlbumsList(function (albumsList){
		console.log("Im in WS");
		albumsManager.setAlbums(albumsList);
		res.json(albumsList);
	});
});

var port =process.env.PORT || 3000;
app.use('/',express.static('./public')).listen(port);
console.log("listening on port " + port +"\n");