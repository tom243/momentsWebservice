var mongoose = require('mongoose');
mongoose.connect('mongodb://moment:12345@ds045242.mongolab.com:45242/moments');
var schemaAlbum = require('./schemaAlbum').schema_name;
var album = mongoose.model('schemaAlbum',schemaAlbum);

mongoose.connection.once('open',function(){
	var album1 = new album({
		id: 1,
		album_name: "Roni Birthday",
		date: "30/05/2014",
		persons: ["tomer","maayan"],
		pic: "http://cdn.searchenginejournal.com/wp-content/uploads/2013/08/photo-album-icon.gif",
		moment_event : ["http://wallpaperose.com/wp-content/uploads/2013/07/Kitten-Hand-Wash-Picture.jpg",
						"https://www.youtube.com/watch?v=Xt0UCge6LBY"]
	});


	var album2 = new album({
		id: 2,
		album_name: "Tomer Birthday",
		date: "04/02/2013",
		persons: ["dani","gal","Rotem"],
		pic: "http://www.whitegadget.com/attachments/pc-wallpapers/73613d1314935965-album-photo-album-photo-wallpaper.jpg",
		moment_event : ["http://wallpaperose.com/wp-content/uploads/2013/07/Kitten-Hand-Wash-Picture.jpg",
						"https://www.youtube.com/watch?v=Xt0UCge6LBY"]
	});
	album1.save(function(err, doc){
		console.log("saved: " + doc);

	});

	album2.save(function(err, doc){
		console.log("saved: " + doc);
		mongoose.disconnect();
	});

});