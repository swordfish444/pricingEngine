
var mongoose = require('mongoose');
var categories = require('./categories.json');

var productSchema = new mongoose.Schema({
	"name": String,
	"brand": String,
	"category": { type: String, enum: categories, default: 'unknown' },
	"subcategory": String,
	"lastPriceAt": { type: Date, default: null },
	"priceRetail": { type: Number, default: -1.0 },
	"priceCurrency": { type: String, enum: ['USD', 'PLN'], default: 'USD'} 
	// Unique Product Identifiers
	"upc": String,
	"isbn": String,
	"ean": String,
	// Manufacturor Part Number
	"mpn": String,
	// Amazon Standard Identification Number
	"asin": String,
	// International Standard Book Number
	"isbn": String,
	"tags": [String],
	"productUri": String,
	"created": { type: Date, default: Date.now },
	"updated": { type: Date, default: null }
}, 
{
    "collection": "Product",
    "autoIndex": false
});

module.exports = productSchema;



