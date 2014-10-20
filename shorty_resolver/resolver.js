var http  = require('http');
var mysql = require('mysql');
var conn  = mysql.createConnection({
    host     : 'localhost',
    user     : 'shorty',
    password : 'shorty',
    database : 'shorty'
})

conn.connect();

var Memcached = require('memcached');
var cache = new Memcached('127.0.0.1:11211');

http.createServer(function(req,res) {

    label = req.url.replace(/\//g,'');

    // Check Cache
    cache.get(label, function(err,long_url) {
      console.log("Cache: %s -> %s", label, long_url);
    });

    // Check DB if not cached
    if ( typeof long_url === 'undefined' ) {
      conn.query('SELECT long_url from shorturl WHERE label = ?',[label], function(err,rows){
        if (err)
          console.log("Error: %s", err);

        if (rows.length > 0) {
          long_url = rows[0].long_url;
          cache.add(label,long_url,1000, function(err) {
            console.log("Error: %s", err);
          });
          console.log("DB: %s -> %s", label, long_url);
        }
      })
    }

    // Redirect or 404
    if ( typeof long_url === 'undefined' ) {
      console.log("Not Found: %s", label);
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.end("404 Not Found");
    } else {
      console.log("Redirect: %s -> %s", label, long_url);
      res.writeHead(302, {
        'Location': long_url
      })
      res.end();
    }

}).listen(7654,'127.0.0.1');

console.log('Shorty is listening on 127.0.0.1:7654');
