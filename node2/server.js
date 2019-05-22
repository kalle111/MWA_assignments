var express = require('express');
var app=express();

// npm install body-parser
var bodyParser = require('body-parser');
var customerController = require('./customerController');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// REST API Asiakas
app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete)
    .get(customerController.fetchOne);
//

app.route('/task')
    .get(function(request, response){
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Here are some tasks ... This is only an example of routing");     
    });

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
