var http  = require('http');
var mysql = require('mysql');
var conn  = mysql.createConnection({
    host     : 'localhost',
    user     : 'shorty',
    password : 'shorty',
    database : 'shorty'
})

conn.connect()

http.createServer(function(req,res) {

    label = req.url.replace(/\//g,'');
    console.log("Querying for %s",label)

    conn.query('SELECT long_url from shorturl WHERE label = ?',[label],function(err,rows){

      if(err)    
        console.log("Error: %s", err);

      if (rows.length > 0) {

        var long_url = rows[0].long_url;
        console.log("Redirect: %s -> %s", label, long_url);
        res.writeHead(302, {
            'Location': long_url
        })
        res.end();

      } else {

        console.log("Not Found: %s", label);
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("404 Not Found");

      }

    })

}).listen(7654,'127.0.0.1');

console.log('Shorty is listening on 127.0.0.1:7654')
