// customController.js
var express = require("express");
var app = express();

//Required in both .js files apparently
//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);
app.use(express.json());

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',  // Note! Do not use root credentials in production!
  password : '',
  database : 'customers',
  multipleStatements: false // Security reasons => sql injection risk.
});

let port = 3030;
console.log("Let's start using express...");
console.log("connection-ping: " + connection.state);

//functional support
function getFullString(preparedStatement,queryObj) {
  let whereSelection = "";
  let andCounter = 0;

  if((queryObj.id =="") && (queryObj.name == "") && (queryObj.address == "") && (queryObj.customer_type == 0)) {
    console.log("##############################");
    return (preparedStatement + "1");
  } else {
      console.log("Sufficient filters!!!!!!!!")
      for (var key in queryObj){
      var attrName = key;
      var attrValue = queryObj[key];
      if(andCounter>0) {
        whereSelection += " AND ";
      }
      switch(attrName) {
        case "id":
          if(attrValue=="") {
            whereSelection += " 1=1 ";
            andCounter++;
            continue;
          } else {
            whereSelection += " ID = " + connection.escape(queryObj[key]);
            andCounter++;
          }
          testPrint(attrName, attrValue);
          break;
        case "name":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Name = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            testPrint(attrName, attrValue);
          break;
        case "address":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Address = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            testPrint(attrName, attrValue);
          break;
        case "customer_type":
            if(attrValue==0) {
  
              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Customer_Type = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            testPrint(attrName, attrValue);
          break;  
      }
  }
  let result = (preparedStatement + whereSelection + ";");
  console.log("final SQL Statement:" + result);
  return (result);
  }
}

function testPrint(attrName, attrValue) {
  console.log("FullString-Func: key => " + attrName + ": VAlue => " + attrValue);
}


//
module.exports = 
{
    fetchAll: function(req, res) {
        //console.log("....in customerController/fetchAll");
        console.log("### QUERY GET: fetchAll startet...");
        console.log(req.query);
        let base_query = 'SELECT * FROM customer WHERE';
        //let qString = "";
        let fullString = getFullString(base_query, req.query);
        /*let test_query = 'SELECT ID, Name, Phone_Number FROM customer WHERE ID=? AND Name=?';
        let c = req.query;*/

        /*let id_constraint = (req.query.id) ? (" ID = " + req.query.id + " AND "):(" ");
        let address_constraint = (req.query.address) ? ("Address = '" + req.query.address + "'"): ("1 AND ");
        let type_constraint = (req.query.custome_type) ? ("Customer_type = " + req.query.custome_type): ("1 AND ");
        let name_constraint = (req.query.name) ? ("Name='" + req.query.name + "';"): (" AND 1;");
        let full_query = base_query + id_constraint + address_constraint + name_constraint;
        console.log(full_query);*/
        //let query = 'SELECT ID, Name, Phone_Number FROM customer WHERE ID=' + req.query.id;
        connection.query(fullString, function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.send(error);
              }
              else
              {
                console.log("Data = " + JSON.stringify(results));
                res.statusCode = 200;
                res.send(results);
              }
        });
      },
      fetchCustomerTypes: function(req,res) {
      //test  
        //console.log("....in customerController/fetchAll");
        
        //console.log(req.query);
        let base_query = 'SELECT * FROM customer WHERE';
        let qString = "SELECT * FROM customer_types WHERE 1;";
        //qString = getFullString(req.query);
        console.log("### PREFETCHING Cust_type combobox => " + qString);
        //console.log(qString);
        //let query = 'SELECT ID, Name, Phone_Number FROM customer WHERE ID=' + req.query.id;
        connection.query(qString, function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.send(error);
              }
              else
              {
                console.log("Data = " + JSON.stringify(results));
                res.statusCode = 200;
                res.send(results);
              }
        });
        /*
        implement logic for dynamic Customer_types!!!!!
        a.) write window.onload()-function in main.html
          a.a.) create basic onload-function => ajax-call
          a.b.) write 
        */
    },
    fetchSelectionData: function(req,res) {
        //res.setHeader('Content-Type', 'json');
        console.log("GET-query" + req.query);
        let query = "SELECT * FROM customer;";
        console.log("Pre-Fetch: " + query);
        connection.query(query, function(error, results, fields) {
          if(error) {
            console.log("SElection-Filter Get-Query is not working!" + erroor);
            res.statusCode = 418; //teapot
            res.send(error);
          } else {
            console.log("Pre-fetched-Selection-data => " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results);
          }
        });
    },
    createCustomer: function(req, res){
        console.log("------------------");
        console.log("CREATE Customer");
        console.log("body : " + JSON.stringify(req.body));
        
        
        var keys = Object.keys(req.body);
        for( var i = 0,length = keys.length; i < length; i++ ) {
          temp = req.body[keys[i]];
          if(temp == "" || temp == null) {
              console.log("Achtung: " + keys[i] + " is undefined or empty.");
              res.statusCode = 418; //teapot
              res.send(error);
          }
          
      }
      let c = req.body;
      var a = [c.Name, parseInt(c.Phone_number), c.Address, parseInt(c.Postal_Code), c.City, c.Customer_Type];
      //console.log(a);
      connection.query("INSERT INTO customer(Name, Phone_Number, Address, Postal_Code, City, Customer_Type) VALUES (?, ?, ?, ?, ?,?);", a,
      function(error, results,fields){
        if ( error ){
          console.log("Error when inserting data to db, reason: " + error);
          res.json(error);
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          c.Name = results.Name;
          res.json(c);
        }
      })

      
      }
}   
// middleware
//public is the folder name in the structure
/*app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile('C:/Users/kalle/Documents/mwa/Assignment REST/REST_1/main.html');
});


app.get("/json", function(req,res) {
    res.send({name: "Jon Doe", address: "RGB"});
});

*/

// 
/*
router.get('/main', function(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.sendFile('C:/Users/kalle/Documents/mwa/Assignment REST/REST_1/main.html');
    res.end();
});
*/
// make the localhost listen to further instructions/input
console.log('is this point actually reached?');
app.listen(port, () => {
    console.log("MySql running AT http://127.0.0.1:" + port + '/');
})


