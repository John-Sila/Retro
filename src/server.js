const http = require("http");

http.createServer( (req, res) => {
    res.writeHead( 200, {"Content-Type":"text/html"} );
    res.write("Hello, from JS&S");
    res.end();
}).listen(8000, () => { console.log("server listening at port 8080"); })