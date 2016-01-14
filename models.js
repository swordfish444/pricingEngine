
var pg = require('pg');
var config = process.myConfig
var debug = require('debug')('pricingEngine:server:db');

var ItemSale = function(){
    // constructor
}
ItemSale.prototype.getCount = function(item, city, next){
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(config.conns.postgres.uri, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return next(err);
        }

        var query;
        // SQL Query > Select Data
        if(city){
            query = client.query({
                text: 'SELECT COUNT(*) as qty FROM "itemPrices_itemsale" WHERE title = $1 AND city = $2',                
                values: [item, city]
            });        
        }
        else{
            query = client.query({
                text: 'SELECT COUNT(*) as qty FROM "itemPrices_itemsale" WHERE title = $1',                
                values: [item]
            });            
        }        

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return next(null, results);
        });
    });
}

ItemSale.prototype.getItem = function(item, city, next){
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(config.conns.postgres.uri, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return next(err);
        }

        var query;
        // SQL Query > Select Data
        if(city){
            query = client.query({
                text: 'SELECT COUNT(*) as qty, list_price FROM "itemPrices_itemsale" WHERE title = $1 AND city = $2 GROUP BY list_price ORDER BY -COUNT(id), -list_price LIMIT 1',
                values: [item, city]
            });        
        }
        else{
            query = client.query({
                text: 'SELECT COUNT(*) as qty, list_price FROM "itemPrices_itemsale" WHERE title = $1 GROUP BY list_price ORDER BY -COUNT(id), -list_price LIMIT 1',
                values: [item]
            });            
        }

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return next(null, results);
        });
    });
}

module.exports.ItemSale = new ItemSale();

