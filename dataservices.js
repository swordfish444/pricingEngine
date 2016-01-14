
var redis = require("redis");
var config = process.myConfig;
var debug = require('debug')('pricingEngine:server:cache');

var MAX_LOCAL_KEYS = 50000;

var RCache = function(){
    this.localCache = {};    
    if(config.conns['redis']){
        var ci = config.conns['redis'];

        this.cache = redis.createClient(ci.port, ci.host, { auth_pass: ci.key });

        this.cache.on("connect", function () {
            debug('[Redis] Connected to RCache.');
        });
        this.cache.on("end", function () {
            debug('[Redis] Ended connection to RCache.');
        });
        this.cache.on("error", function (error) {
            debug('[Redis] Error occurred', error);
        });         
    }
};

RCache.prototype.get = function(key, callback){
    var self = this;

    if(self.localCache[key]){
        var value = self.localCache[key];
        return process.nextTick(function(){ callback(null, value); });   
    } 
    else if(self.cache){
        self.cache.get(key, function(error, value) {
            if(value && Object.keys(self.localCache).length < MAX_LOCAL_KEYS){
                self.localCache[key] = value;
            }         
            callback(error, value);
        });          
    }
    else process.nextTick(callback);      
}

RCache.prototype.set = function(key, value, callback){
    var self = this;

    if(value && Object.keys(self.localCache).length < MAX_LOCAL_KEYS){
        self.localCache[key] = value;
        process.nextTick(callback);
    }
    if(value && self.cache){
        self.cache.set(key, value, function(error){

        });       
    }    
}


module.exports.RCache = new RCache();
