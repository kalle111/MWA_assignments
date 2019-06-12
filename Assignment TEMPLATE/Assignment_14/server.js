var express = require('express');
var app=express();
const path = require('path');

var Student = require('./studentModel');

// npm install body-parser --save
var bodyParser = require('body-parser');
var studentController = require('./studentController');

var expressValidator = require('express-validator');
var cons = require('consolidate');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

var appController = require('./appController');
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// mongoose instance connection url connection
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Student', {useNewUrlParser: true}); 
console.log(mongoose.connection.readyState);
//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

let startTime = new Date();

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REST api
// for testing purposes
app.route('/')
  .get(appController.getMainApp);


//testing end    

app.route('/student')
    .get(studentController.fetchAll);
    
/* not used.
app.route('/student/:studentid')
    .put(studentController.update)
    .delete(studentController.delete);
*/
app.route('/student/add/')
    .post(appController.newStudent);

app.route('/filtered')
    .post(appController.getMainAppFiltered);

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
