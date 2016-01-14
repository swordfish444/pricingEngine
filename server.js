/**
 * Module dependencies.
 */

var fs = require('fs');
var defaultConfig = {
    "cache-ttl": 86400,
    "conns": {
        "postgres": {
            "uri": "postgres://offerupchallenge:ouchallenge@offerupchallenge.cgtzqpsohu0g.us-east-1.rds.amazonaws.com:5432/itemprices"
        }    
    }
};

fs.exists('./config.json', function(exists) {
    process.myConfig = exists ? require('./config.json') : defaultConfig;
    var http = require('http');
    var app = require('./app.js');
    var debug = require('debug')('pricingEngine:server');


    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || '8080');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    /**
     * This initializes a connection pool
     * it will keep idle connections open for a (configurable) 30 seconds
     * and set a limit of 20 (also configurable)
     */


    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }     
});

