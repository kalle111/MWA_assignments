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
//instantly make all files in /public/ as public => index.html will be rendered upon calling domain/
app.use(express.static('public'));

/*app.get('/', function(req, res) {
    res.sendFile(__dirname + '/main.html');
});*/


// REST API Asiakas
app.route('/allcustomers/') 
    .get(customerController.fetchAll);

app.route('/customer_type_fetch/')
    .get(customerController.fetchCustomerTypes);
    
app.route('/task')
    .get(function(request, response){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Here are some tasks ... This is only an example of routing");     
    });
app.route('/customer/delete/:id')
    .delete(customerController.deleteCustomer);

app.route('/customer/update/:id')
    .delete(customerController.deleteCustomer);

app.route('/customer/info/:id')
    
    .get(customerController.getCustomer);
/*
app.route('/customer/delete/')
    .get(customerController.delete);
*/
app.route('/customer/create/:id')
    .post(customerController.createCustomer);
app.route('/jquery')
    .get(function(request,response){
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.sendFile("C:/Users/kalle/Documents/mwa/Assignment REST/REST_1/libs/jquery-3.1.0.js")
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
