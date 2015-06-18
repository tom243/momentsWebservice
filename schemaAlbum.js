var mongoose = require('mongoose');
var schema = mongoose.Schema;

var schema_name = new schema({
	album_name: {type:String,required:true, index: 1,unique: true},
	date: String,
	persons: [String],
	pic:String,
	creation_address:String,
	moment_event:[String]
}, {collection: 'Albums'});
exports.schema_name = schema_name;