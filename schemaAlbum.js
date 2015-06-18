var mongoose = require('mongoose');
var schema = mongoose.Schema;

var schema_name = new schema({
	id:{type:Number,required:true},
	album_name: {type:String,required:true},
	date: String,
	persons: [String],
	pic:String,
	creation_adress:String,
	moment_event:[String]
}, {collection: 'Albums'});
exports.schema_name = schema_name;