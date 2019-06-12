// npm install express
// npm install handlebars
// npm install consolidate

var express = require('express');
var cons = require('consolidate');
var app = express();
var path = require('path');
var customerController = require('./studentController');
var bodyParser = require('body-parser');
var session = require('express-session'); // npm install express-session
//var passport = require('passport');
var cookieParser = require('cookie-parser');

var expressValidator = require('express-validator'); //npm install express-validator (marc)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator()); //validate input and sanitize it. // important: after body-parser.
// Print all possible template engines
//console.log(cons);

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))



app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//redirect middleware
const redirectLogin = (req,res,next) => {
    //console.log("#############################\nReq in Redirect\n##############################\n", req);
    //console.log("Session-check in redirect.");
    if(!req.session.username) {
        res.render('main', {
            message: "You can't access important data before authenticating!!"
        });
    } else {
        console.log("#############################\nReqSession\n##############################\n" ,req.session);
        next();
    }
};
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
    console.log("Login: ", req.session);
    req.session.touch();
    try {
        customerTypes = await customerController.fetchCustomerTypes();
        preFetchCustomerTypes = customerTypes;
    } catch (error) {

    } finally {
        let message = ""
        res.render('main', {
            title: "Assignment 12",
            subtitle: "Customer-Fetching",
            preFetchCustomerTypes : preFetchCustomerTypes,
            message:message
        });
    }
  });

app.post('/fetchFilteredCustomers', redirectLogin,async function(req,res) {
        /*    
        res.write('hello');
        res.send();
        */
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
            res.render('main', {
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

                console.log("FetchFiltered, after querying db");
            } catch (error) {
                console.log("error while fetching filtered Customers: " + error);
            } finally {
                req.session.save();
                console.log("Last Session-Check before rendering the Customer-Fetch:::::::", req.session);
                res.render('fetch', {
                    title: "Assignment 12",
                    subtitle: "Customer-Fetching",
                    preFetchCustomerTypes : preFetchCustomerTypes,
                    filteredCustomers : filteredCustomers
                }); 

                
            }
        }

}); 
app.get('/main', async function(req,res) {
    customerTypes = [];
    res.redirect('/');
});

app.post('/login', async function(req, res){
    req.checkBody("username", "ID input bad.").notEmpty().withMessage("is empty").trim().escape();
    req.checkBody("password", "Bad input: name").notEmpty().withMessage("is empty").trim().escape();
    
    var loginDetails = {
        loginBool : false,
        loginID: null
    };

    const username = req.body.username;
    const password = req.body.password;

    try {
        const sqlResult = await customerController.checkLoginData(username, password);
        let strRes = JSON.stringify(sqlResult).split(":")[1].split('"')[1];
        console.log(strRes);
        /*async function(sqlResult) {

        }*/
        req.session.username = strRes;
        console.log("Session, right after QUERY: ", req.session);
        req.session.save();
        //some datatype
        if(sqlResult.length == 0) {
            console.log(`Failed login-attempt by ${username}, with the password ${password}`);
            let message = "Login failed. Try again with a different username/password.";
            res.render('main', {
                title: "Assignment 13",
                subtitle: "Login-logic",
                message: message
            });
        } else  {
            console.log(">>> RESULT after length-check: ",sqlResult);
            console.log(">>>>> Session after length check: ", req.session);
            req.session.save();
            res.redirect('fetch');
        }
    } catch (error) {
        console.log("SQL-Error => no login possible: " + error);
    } 
});

app.get('/assignment', redirectLogin, async function(req,res) {
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
        res.render('fetch', {
            title: 'Assignment 10',
            assignmentDesc: '=> click on "League Table" to fetch League table data below!',
            events: events,
            preFetchCustomerTypes,
            selectOption : selectOption
        });
    }
});
app.get('/leaguetable', redirectLogin, async function(req,res) {
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
        res.render('fetch', {
            title: 'Assignment 11',
            assignmentDesc: '=> click on "Playerdetails" to fetch Player/Team data below!',
            events: events,
            selectOption : selectOption,
            leaguetable: leaguetable
        });
    }
});
app.get('/logout', function(req,res){
    console.log("current session before logout: ",req.session);
    req.session.destroy();
    console.log("current session after destroy()", req.session);
    res.redirect('/');
});

app.get('/playerdetails', redirectLogin, async function(req,res) {

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
            res.render('fetch', {
                title: 'Assignment 11',
                assignmentDesc: '=> click on "Playerdetails" to fetch Player/Team data below!',
                events: events,
                selectOption : selectOption,
                playerDetails : playerDetails,
                teamDetails : teamDetails
            });
        }
});
app.get('/client', redirectLogin, function(req,res){

    //console.log("path = " + path.join(__dirname));
    //console.log("dirname = " + __dirname);

    console.log("Current user is " + req.session.username);

    res.sendFile(path.join(__dirname + '/views/client.html'));
});

app.get('/fetch', redirectLogin, async function(req,res){

    //console.log("path = " + path.join(__dirname));
    //console.log("dirname = " + __dirname);
    
    console.log("Current user is " + req.session.username);

    try {
        customerTypes = await customerController.fetchCustomerTypes();
        preFetchCustomerTypes = customerTypes;
    } catch (error) {

    } finally {
        res.render('fetch', {
            title: "Assignment 12",
            subtitle: "Customer-Fetching",
            preFetchCustomerTypes : preFetchCustomerTypes
        });
    }
});

app.listen(3003);
console.log('Express server listening on port 3003');