var mongoose = require('mongoose');
var schema = mongoose.Schema;

var album_schema = new schema({
	album_name : {
		type : String,
		required : true,
		index : 1,
		unique : true
	},
	creator_name : {
		type : String,
		required : true,
		index : 1,
		unique : true
	},
	date : String,
	persons : [String],
	pic : String,
	creation_address : String,
	moment_event : [{
		moment_input : String,
		moment_type : String,
		creation_time : String,
		owner : String,
		moment_latitude : Number,
		moment_longitude : Number
	}],
	mobile_event : Boolean
}, {
	collection : 'Albums'
});

exports.album_schema = album_schema;

var contact_schema = new schema({
	name : {
		type : String,
		required : true,
		index : 1,
		unique : true
	}
}, {
	collection : 'Users'
});

exports.contact_schema = contact_schema;
