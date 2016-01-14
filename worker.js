


/* NOT BEING USED --- FOR CHILD THREADS 
var redis = require("redis");
var config = process.myConfig;
var debug = require('debug')('pricingEngine:server:cache');
var path = require('path');
var ci = config.conns['redis'];

var MAX_LOCAL_KEYS = 50000;
var localCache = {};


var cache = redis.createClient(ci.port, ci.host, { auth_pass: ci.key });

cache.on("connect", function () {
    debug('[Redis] Connected to RCache.');
});
cache.on("end", function () {
    debug('[Redis] Ended connection to RCache.');
});
cache.on("error", function (error) {
    debug('[Redis] Error occurred', error);
}); 

module.exports.get = function (key, ttl, callback) {
    if(localCache[key]) return process.nextTick(function(){ callback(null, localCache[key]); });
    else if(Object.keys(localCache).length > MAX_LOCAL_KEYS){
        cache.get(key, function(error, value) {
            if (ttl) cache.expire(key, ttl);
            callback(error, value);
        });          
    }
    else process.nextTick(callback); 
}

module.exports.set = function(key, value, ttl, callback){
    if(Object.keys(localCache).length <= MAX_LOCAL_KEYS){
        localCache[key] = value;
        return process.nextTick(callback);
    }
    else{
        cache.set(key, value, function(error){
            if (ttl) cache.expire(key, ttl);
            callback(error);
        });       
    }    
}
************************/