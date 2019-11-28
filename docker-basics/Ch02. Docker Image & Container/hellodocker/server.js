var http = require('http');

var port = 3000;

var server =  http.createServer( function( request, response ) {
    console.log( "request[" + request.url + "] received");
    response.writeHead( 200, {
        "Content-Type": "text/html"
    });
    response.end(  "Hello Docker\n"  );
} );

server.listen( port, function() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.debug('Listening on ' + bind);
});