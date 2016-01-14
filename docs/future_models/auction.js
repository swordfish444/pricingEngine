
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var auctionSchema = new mongoose.Schema({
	"account": { type: ObjectId, ref: 'account', default: null },
	"products": [{ 
		"product": { type: ObjectId, ref: 'product' }, 
		"qty": Number, 
		"condition": { type: String, enum: ['new','like-new','fair','used'], default: 'new' } 
	}],
	"offers": [{ type: ObjectId, ref: 'offer' }],
	"accepted": { type: ObjectId, ref: 'offer', default: null },
	"status": { type: String, enum: ['pending','in-progress','ended'], default: 'pending' },
	"outcome": { type: String, enum: ['canceled', 'sold', 'not-sold', 'tbd'], default: 'tbd' },
	"tags": [String],	
	"created": { type: Date, default: Date.now },
	"updated": { type: Date, default: null }
}, 
{
    "collection": "Auction",
    "autoIndex": false
});

module.exports = auctionSchema;



