var http = require("http");
var fs = require("fs");

console.log("Hello user");

http.createServer(function(req,res){
    //console.log("request:", req);
    if(req.url === '/test') 
    {
        //res.write('dod this');
        //res.end();

        fs.readFile("./some.html", function(data, err) {
            // basic idea of blocking or not
            res.write(data);
            res.end();
        });
        console.log("Let's move on...");
    } else {
        res.write("nothing");
        res.end();
    }

    res.end();
    //nodemon to get the webserver running
}).listen(3002);

console.log("Server is runnin on port 3002");