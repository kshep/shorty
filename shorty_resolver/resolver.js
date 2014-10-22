var http  = require('http');
var mysql = require('mysql');
var conn  = mysql.createConnection({
    host     : 'localhost',
    user     : 'shorty',
    password : 'shorty',
    database : 'shorty'
});

conn.connect();

var Memcached = require('memcached');
var cache = new Memcached('127.0.0.1:11211');

http.createServer(function(req,res) {

    label = req.url.replace(/\//g,'');

    cache.get(label, function(err,long_url) {

      if (err) {
        console.log("Cache Error: %s", err);
        res.end("500 Internal Server Error");

      } else if (long_url) {

        console.log("Cache Redirect: %s -> %s", label, long_url);
        res.writeHead(302, { "Location": long_url });
        res.end();

      } else {

        conn.query('SELECT long_url from shorturl WHERE label = ?',[label], function(err,rows){

          if (err) {
            console.log("Error: %s", err);
            res.end("500 Internal Server Error");

          } else if (rows.length > 0) {

            long_url = rows[0].long_url;
            cache.add(label,long_url,1000, function(err) {
              if (err) {
                console.log("Cache add error: %s", err);
              }
            });
            console.log("DB Redirect: %s -> %s", label, long_url);
            res.writeHead(302, { "Location": long_url });
            res.end();

          } else {

            console.log("Not Found: %s", label);
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("404 Not Found");

          }
        });
      }
    });
}).listen(7654,'127.0.0.1');

console.log('Shorty is listening on 127.0.0.1:7654');
