

var express = require('express');
var router = express.Router();
var async = require('async');
var debug = require('debug')('pricingEngine:server:api');

// Pull in applicable models (only one)
var models = require('./models.js');
var itemSale = models.ItemSale;

// Pull in configuration 
var config = process.myConfig;
var ttl = parseInt(config['cache-ttl']);
// Establish connections to external data services
var rcache = require('./dataservices.js').RCache;


var Content = function(status){
	if(status == 404) this.message = "Not found";
    else if(status > 404) this.message = "Internal system error";
	else {
		this.item = "";
		this.item_count = 0;
		this.price_suggestion = 0;
		this.city = "__all__";
	}
}
Content.prototype.getKey = function(){
    var key = this.item.toLowerCase() + ":" + this.city.toLowerCase();
    return key;
}  
Content.prototype.getValue = function(){
    var value = this.item_count + ":" + this.price_suggestion;
    return value;
} 
Content.prototype.addToCache = function(next){
    var self = this;
    rcache.set(self.getKey(), self.getValue(), ttl, next);
}
Content.prototype.calculate = function(item, city, next){
	var self = this;
	if(city) self.city = city;
    else self.city = 'Not specified';
	self.item = item;

    rcache.get(self.getKey(), config['cache-ttl'] || null, function(error, value){
        if(error) debug(error);
        // Cache-miss
        if(!value){
            async.parallel([
                function(cb){
                    itemSale.getItem(item, city, function(error, results){
                        if(error || !results ) return next(error);
                        if(results.length <= 0 ){
                            self.price_suggestion = 0;
                        }
                        else{
                            var data = results[0];
                            self.price_suggestion = Math.ceil(data.list_price);                            
                        }
                        cb();
                    });
                },
                function(cb){
                    itemSale.getCount(item, city, function(error, results){
                        if(error || !results) return next(error);
                        if(results.length <= 0 ){
                            self.item_count = 0;
                        }
                        else{
                            var data = results[0];
                            self.item_count = data.qty;                            
                        }                            
                        cb();
                    });
                }
            ], 
            function(error){
                // Add result to cache
                self.addToCache(next);              
            });
        }
        // Cache-hit
        else{
            var values = value.split(':');
            self.item_count = parseInt(values[0]);
            self.price_suggestion = parseInt(values[1]);
            next();
        }
    })
}

// Enveloped response object
var ApiResponse = function(status){
	this.status = status && typeof parseInt(status) === 'number' ? parseInt(status) : 500;
	this.content = new Content(this.status); // <--- Neat aye? =)
}

// Home
router.get('/', function(req, res, next) {
    return res.json({
        "status": 200,
        "message": "System is online!"
    });
});

// Service endpoint
router.get('/item-price-service', function(req, res, next) {
	if(!req.query.item) return res.status(404).json(new ApiResponse(404));
	var apiResponse = new ApiResponse(200);
    apiResponse.content.calculate(req.query.item, req.query.city || null, function(error){
        if(error) debug(error);
        return res.json(apiResponse);
    });
});

module.exports = router;