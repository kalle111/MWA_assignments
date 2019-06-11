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
var expressValidator = require('express-validator'); //npm install express-validator (marc)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());
// Print all possible template engines
//console.log(cons);

// Sessions
/*app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
*/


app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

/*
var events = [];
var selectOption = [];
//var leaguetable = [];
//var playerDetails = [];
*/
var preFetchCustomerTypes = [];
/*var users = [];
users.push({ name: 'Matt' });
users.push({ name: 'Karl' });
users.push({ name: 'Markus' });*/

app.get('/', async function(req, res) {
    var customerTypes = [];
    
    try {
        customerTypes = await customerController.fetchCustomerTypes();
        preFetchCustomerTypes = customerTypes;
    } catch (error) {

    } finally {
        res.render('index', {
            title: "Assignment 12",
            subtitle: "Customer-Fetching",
            preFetchCustomerTypes : preFetchCustomerTypes
        });
    }
    
  });

app.post('/fetchFilteredCustomers', async function(req,res) {
        var filteredCustomers = [];    

        //validating and sanitizing input
        req.checkBody("id", "ID input bad.").notEmpty().withMessage("is empty").isLength({max:3}).withMessage("ID too big. >1000").trim().escape();
        req.checkBody("name", "Bad input: name").notEmpty().withMessage("is empty").trim().escape();
        req.checkBody("address", "Bad input: address").notEmpty().withMessage("is empty").trim().escape();
        req.checkBody("customer_type").trim().escape();
        var errors = req.validationErrors();

        var realErrors = [];
        errors.forEach(function(element) {
            //console.log(element);
            if(element.msg != ("is empty")) {
                realErrors.push(element);
            }
        });
        //if input is invalid except for empty inputfields
        if(realErrors.length > 0) {
            res.render('index', {
                title: "Assignment 12",
                subtitle: "Customer-Fetching",
                preFetchCustomerTypes : preFetchCustomerTypes,
                realErrors:realErrors
            });
        } else {
            //regular treatment.
            try {
                filteredCustomers = await customerController.fetchFilteredCustomers(req.body);
                customerTypes = await customerController.fetchCustomerTypes();
                preFetchCustomerTypes = customerTypes;
            } catch (error) {
                console.log("error while fetching filtered Customers: " + error);
            } finally {
                res.render('index', {
                    title: "Assignment 12",
                    subtitle: "Customer-Fetching",
                    preFetchCustomerTypes : preFetchCustomerTypes,
                    filteredCustomers : filteredCustomers
                });
            }
        }

}); 
app.get('/index', async function(req,res) {
    customerTypes = [];

    try {
        customerTypes = await customerController.fetchCustomerTypes();
        preFetchCustomerTypes = customerTypes;
    } catch (error) {

    } finally {
        res.render('index', {
            title: "Assignment 12",
            subtitle: "Customer-Fetching",
            preFetchCustomerTypes : preFetchCustomerTypes
        });
    }
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
    let events1 = [];
    let selectOption1 = [];
    try{
        events1 = await customerController.fetchNextEvents();
        selectOption1 = await customerController.fetchSelectOptions();
        events= events1;
        selectOption = selectOption1;
        //console.log(events1);
        //console.log("HELLOOOOOOO: " + events[0].EventName);
    } catch(error) {
        console.log("ERROR in fetching data from db, reason:" + error)
    } finally {
        res.render('assignment', {
            title: 'Assignment 10',
            assignmentDesc: '=> click on "League Table" to fetch League table data below!',
            events: events,
            selectOption : selectOption
        });
    }
    
});
app.get('/leaguetable', async function(req,res) {
    //console.log("#######################");
    //console.log(events);
    let leagueTable = [], leaguetable;
    try{
        leagueTable = await customerController.fetchLeagueTable();
        leaguetable = leagueTable.sort(sortByPlace);
        
        //sorted print
        function sortByPlace(a, b) {
            if ( a.Team_id < b.Team_id ){
              return -1;
            }
            if ( a.Team_id > b.Team_id ){
              return 1;
            }
            return 0;
        }


    } catch(error) {
        console.log("ERROR in fetching league-table from db, reason:" + error)
    } finally {
        res.render('assignment', {
            title: 'Assignment 11',
            assignmentDesc: '=> click on "Playerdetails" to fetch Player/Team data below!',
            events: events,
            selectOption : selectOption,
            leaguetable: leaguetable
        });
    }
});
app.get('/playerdetails', async function(req,res) {

        let playerDetails = [], teamDetails = [];
        try{
            playerDetails = await customerController.fetchPlayerDetails();
            //playerDetails = playerDetails.sort(sortByPlayerId);
            teamDetails = await customerController.fetchTeamDetails();
            teamDetails = teamDetails.sort(sortByTeamId);
            
            //sorted print
            function sortByTeamId(a, b) {
                if ( a.Team_id < b.Team_id ){
                  return -1;
                }
                if ( a.Team_id > b.Team_id ){
                  return 1;
                }
                return 0;
            }

            function sortByPlayerID(a,b) {
                if ( a.Id < b.Id ){
                    return -1;
                  }
                  if ( a.Id > b.Id ){
                    return 1;
                  }
                  return 0;
            }
        } catch(error) {
            console.log("ERROR in fetching league-table from db, reason:" + error)
        } finally {
            res.render('assignment', {
                title: 'Assignment 11',
                assignmentDesc: '=> click on "Playerdetails" to fetch Player/Team data below!',
                events: events,
                selectOption : selectOption,
                playerDetails : playerDetails,
                teamDetails : teamDetails
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