var express = require('express');
var url = require('url');
var app = express();
var cloudinary = require('cloudinary');
var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require("body-parser");
var albums = require('./albumsManager');
var contacts = require('./contactsManager');

var albumsManager = albums.getAlbumsManager();
// contains instance of albumsManager
var contactsManager = contacts.getContactsManager();
// contains instance of contactsManager

cloudinary.config({
	cloud_name : 'sharedmoments',
	api_key : '358883576846297',
	api_secret : 'Rvl3srG9ODTOLyRgD8H9nRg7sk0'
});

//  check if object is empty
function isEmptyObject(obj) {
	for (var key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			return false;
		}
	}
	return true;
}

//Get all albums from Data base to fill the cache
albumsManager.getAllAlbumList(function(albumsList) {
	albumsManager.setAlbums(albumsList);
	// Set the album list to array cache
	//Get all contacts from Data base to fill the cache
	contactsManager.getAllContacts(function(contactList) {
		contactsManager.setAllContacts(contactList);
		// Set the contact list to array cache
	});
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res) {
	res.send("Welcome to sheared moments");
});

app.post('/getAllAlbumsPerUser', function(req, res) {
	var query = req.body.activeUser;

	console.log("query " + query);
	console.log("In getAllAlbumsPerUser route\n");
	app.set('json space', 3);
	albumsManager.getAllAlbumListPerUser(query, function(albumsList) {
		console.log(albumsList);
		res.json(albumsList);
	});
});

app.post('/createAlbum', function(req, res) {
	console.log("In createAlbum route\n");
	app.set('json space', 3);
	var dataForm = {};
	var form = new formidable.IncomingForm();
	var ImageSend = false;
	var defaultUrl = "http://s11.postimg.org/ypkjkrdz7/album.png";
	// default pic

	form.parse(req, function(error, fields, files) {
		console.log('-->PARSE<--');
		dataForm = fields;
		//save the fields information
		if (!isEmptyObject(files)) {
			ImageSend = true;
		}
	});

	form.on('error', function(err) {
		console.log("in form on error " + err);

	});

	form.on('end', function(error, fields, files) {
		console.log("form on event");
		if (ImageSend) {
			var temp_path = this.openedFiles[0].path;
			var stream = cloudinary.uploader.upload_stream(function(result) {
				console.log("in result from cloudinary");
				urlImg = result.url;
				console.log("verify album name is correct, the name is :" + dataForm.album_name + "\n");
				albumsManager.createAlbum(dataForm.album_name, dataForm.creator_name, dataForm.persons, urlImg, dataForm.creation_address, dataForm.momentEvent, dataForm.mobile_event, function(album) {
					albumsManager.addAlbum(album);
					res.json(album);
				});
			});
			var file_reader = fs.createReadStream(temp_path).pipe(stream);
		} else {
			albumsManager.createAlbum(dataForm.album_name, dataForm.creator_name, dataForm.persons, defaultUrl, dataForm.creation_address, dataForm.momentEvent, dataForm.mobile_event, function(album) {
				albumsManager.addAlbum(album);
				res.json(album);
			});
		}
	});

});

app.post('/checkRegisteredUser', function(req, res) {
	var user = req.body.activeUser;
	app.set('json space', 3);
	console.log("user" + user);
	var isExists = contactsManager.checkRegisteredUser(user);
	console.log("isExists " + isExists);
	res.json({
		"exists" : isExists
	});

})

app.get('/viewAlbum', function(req, res) {
	app.set('json space', 3);
	var albumName = req.query.album_name;
	console.log("verify album name is correct, the name is :" + albumName + "\n");
	res.json(albumsManager.getAlbum(albumName));
});

app.post('/sendToBackEnd', function(req, res) {
	app.set('json space', 3);
	var dataForm = {};
	var form = new formidable.IncomingForm();

	form.parse(req, function(error, fields, files) {
		console.log('-->PARSE files from owner<--');
		dataForm = fields;
		//save the fields information
	});

	form.on('error', function(err) {
		console.log("in form on error " + err);

	});

	form.on('end', function(error, fields, files) {

		if (dataForm.fileType == "uploadVideo") {
			var temp_path = this.openedFiles[0].path;
			console.log("dataForm.type " + dataForm.fileType);
			cloudinary.uploader.upload(temp_path, function(result) {
				url = result.url;
				albumsManager.insertMomentToAlbum(url, "video", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude, function(file) {
					console.log("In callback video from data base when save moments");
					if (file != false) {
						albumsManager.addMomentToCache(url, "video", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude);
						res.json({
							"momentType" : "video"
						});
					} else {
						res.json({
							"momentError" : "error in upload moment to db"
						});
					}
				});
			}, {
				resource_type : "video"
			}, {
				video_codec : "auto"
			});

		} else if (dataForm.fileType == "uploadPicture") {
			var temp_path = this.openedFiles[0].path;
			console.log("dataForm.type " + dataForm.fileType);
			var stream = cloudinary.uploader.upload_stream(function(result) {
				console.log("in result from cloudinary");
				url = result.url;
				console.log("dataForm.album_name " + dataForm.album_name);
				albumsManager.insertMomentToAlbum(url, "image", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude, function(file) {
					console.log("In callback image from data base when save moments");
					if (file != false) {
						albumsManager.addMomentToCache(url, "image", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude);
						res.json({
							"momentType" : "image"
						});
					} else {
						res.json({
							"momentError" : "error in upload moment to db"
						});
					}
				});
			});
			var file_reader = fs.createReadStream(temp_path).pipe(stream);

		} else {// In uploadText
			albumsManager.insertMomentToAlbum(dataForm.userTextInput, "text", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude, function(file) {
				console.log("In callback text from data base when save moments");
				if (file != false) {
					albumsManager.addMomentToCache(dataForm.userTextInput, "text", dataForm.album_name, dataForm.creation_time, dataForm.owner, dataForm.latitude, dataForm.longitude);
					res.json({
						"momentType" : "text"
					});
				} else {
					res.json({
						"momentError" : "error in upload moment to db"
					});
				}
			});
		}

	});

});

app.get('/contacts', function(req, res) {
	app.set('json space', 3);
	contactsManager.getAllContacts(function(contactList) {
		contactsManager.setAllContacts(contactList);
		// Set the contact list to array cache
		console.log(contactList);
		res.json(contactList);
	});
});

var port = process.env.PORT || 3000;
app.use('/', express.static('./public')).listen(port);
console.log("listening on port " + port + "\n");

