// npm install express
// npm install handlebars
// npm install consolidate

var express = require('express');
var cons = require('consolidate');
var app = express();
var path = require('path');
var customerController = require('./customerController');
var bodyParser = require('body-parser');
var session = require('express-session'); // npm install express-session

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Print all possible template engines
//console.log(cons);

// Sessions
/*app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
*/
let events = [];
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

var users = [];
users.push({ name: 'Matt' });
users.push({ name: 'Karl' });
users.push({ name: 'Markus' });

app.get('/', function(req, res) {
  res.render('index', {
    title: 'MARC::: Template engine demo',
    subtitle: 'marvelous'
  });
});

app.get('/users', function(req, res) {
    customerController.fetchTypes().
    then(function(data){
        console.log("data (index.js) = " + JSON.stringify(data));
        return data;    
    })
    .then((types) => {
        return types;
    })
    .catch(function(msg){
        console.log("We had en error occured " + msg);
    })
    .then((types) => {
        // This will be executed despite the error 
        if ( types == null ) types = [{ Avain:-1, Lyhenne: "ALL", Selite: "Empty" }];
        
        res.render('users', {
            title: 'Users',
            users: users,
            languages: ['php', 'node', 'ruby'],
            types : types
        });        
    });
});

app.get('/users_rev', async function(req, res) {
    console.log("Let's do asyncronous call with await");
    let types = [];
    try
    {
        types = await customerController.fetchTypes();
        if ( types == null ) types = [{ Avain:-1, Lyhenne: "ALL", Selite: "Empty" }];        
    }
    catch(error)
    {
        console.log("ERROR in fetching data from db, reason:" + error);
    }
    finally
    {
        res.render('users', {
            title: 'Users',
            users: users,
            languages: ['php', 'node', 'ruby'],
            types : types
        });        
    }
});

app.post('/login', function(req, res){

    console.log('/login: data=', req.body);
    let username = req.body.username;
    let password = req.body.password;

    //types = await customerController.fetchTypes();

    if ( username == "kalle" && password == "xx" )
    {
        req.session.username = username;
        res.redirect('/client');
    }
    else
    {
         
        //You could do like this but check url, now there is /login instead of /main
        /*
        res.render('login', {
            message: 'Wrong username or password',
        });*/        
    
        // Or like this
        // Or store error message to session/cookie 
        res.redirect('/main?message=Wrong username or password');
    }
});

app.get('/assignment', async function(req,res) {
    let selectOption = [];
    try{
        events = await customerController.fetchNextEvents();
        selectOption = await customerController.fetchSelectOptions();
        //console.log("HELLOOOOOOO: " + events[0].EventName);
    } catch(error) {
        console.log("ERROR in fetching data from db, reason:" + error)
    } finally {
        res.render('assignment', {
            title: 'Assignment 9',
            events: events,
            selectOption : selectOption
        });
    }
    
});

app.get('/client', function(req,res){

    //console.log("path = " + path.join(__dirname));
    //console.log("dirname = " + __dirname);

    console.log("Current user is " + req.session.username);

    res.sendFile(path.join(__dirname + '/views/client.html'));
});

app.get('/main', function(req,res){

    console.log("start /main");

    let msg = 'Welcome to my application';

    if ( req.query.message )
        msg = req.query.message;

    res.render('login', {
        message: msg,
    });        

    //res.sendFile(path.join(__dirname + '/views/login.html'));
});


app.listen(3003);
console.log('Express server listening on port 3003');

