var express = require('express');
var app=express();
//const path = require('path');


// npm install body-parser
var bodyParser = require('body-parser');
var customerController = require('./customerController');

const hostname = '127.0.0.1';
const port = 3031;
//const port = process.env.PORT || 3030;

//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(express.json());

// Middleware: Reads HTTP request + creates body block
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/main.html');
});

app.get('/new', function(req, res) {
    res.sendFile(__dirname + '/some.html');
});
/*
app.get("", function(req, res) {
    //this method is a request handler.
    res.setHeader("Content-Type", "text/html");
    res.sendFile("C:/Users/kalle/Documents/mwa/Assignment REST/REST_1/main.html");
    res.end();
});*/



// REST API Asiakas
app.route('/allcustomers/') 
    .get(customerController.fetchAll);

app.route('/customer_type_fetch/')
    .get(customerController.fetchFiltered);
    
app.route('/task')
    .get(function(request, response){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Here are some tasks ... This is only an example of routing");     
    });

/*  
app.route('/Asiakas/:id')
        .put(customerController.update)
        .delete(customerController.delete)
        .get(customerController.fetchOne);
    //
*/

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
