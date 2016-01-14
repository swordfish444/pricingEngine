
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var offerSchema = new mongoose.Schema({
	"account": { type: ObjectId, ref: 'account', default: null },
	"auction": { type: ObjectId, ref: 'auction', default: null },
	"bidAmount": { type: Number, default: 0.0 },
	"isValid": { type: Boolean, default: true },
	"created": { type: Date, default: Date.now },
	"updated": { type: Date, default: null }
}, 
{
    "collection": "Offer",
    "autoIndex": false
});

module.exports = offerSchema;



