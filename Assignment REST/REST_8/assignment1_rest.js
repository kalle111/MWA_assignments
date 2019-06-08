var express = require('express');
var app=express();
//const path = require('path');


// npm install body-parser
var bodyParser = require('body-parser');
var customerController = require('./customerController');
// to ensure data integrity for REST Assignment 1-6
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// ports/host
const hostname = '127.0.0.1';
const port = 3031;
//const port = process.env.PORT || 3030;

//dataVersioning
const dataVersion = 0; //set after first update, checked before next get 
module.exports.dataVersion = dataVersion;

//Server-Up-time
const startTime = (Date.now()/1000); //Start time in UNIX-Time in seconds

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


//Static ressources in /project/public/....
app.use(express.static('public'));
// Sets own response-header
app.use(ownHeader);
//logs all requests in console
app.use(log);

//middleware Functions
function log(req,res,next) {
    console.log(new Date(), "Method: " + req.method + ", URL: "+req.url + ", FROM: " + req.connection.remoteAddress);
    next();
}
//Header middleware
function ownHeader(req,res,next){
    let timeNow = (Date.now()/1000); //UNIX-time in seconds
    let timeDiff = timeNow-startTime;
    res.setHeader('KALLE-SERVER-TIME', Math.round(timeDiff));
    next();
}

// REST API
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
    .post(customerController.getCustomerForDelete)
    .post(customerController.addPhoneToBlocked)
    .post(customerController.deleteCustomer);

app.route('/customer/add/')
    .post(customerController.createCustomer);

app.route('/customer/info/:id')
    .get(customerController.getCustomer);

app.route('/customer/update/:id')
    .put(customerController.updateCustomerData);


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
