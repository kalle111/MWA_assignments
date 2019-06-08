// customController.js
var express = require("express");
var app = express();
var assignment1_rest = require('./assignment1_rest');

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
var cookieParser = require('cookie-parser');
app.use(cookieParser());


var mysql = require('mysql');

const updateCounter = 0; 
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',  // Note! Do not use root credentials in production!
  password : '',
  database : 'customers',
  multipleStatements: false // Security reasons => sql injection risk.
});

let port = 3030;

//functional support
function getFullString(preparedStatement,queryObj) {
  let whereSelection = "";
  let andCounter = 0;

  if((queryObj.id =="") && (queryObj.name == "") && (queryObj.address == "") && (queryObj.customer_type == 0)) {
    return (preparedStatement + "1");
  } else {
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
  return (result);
  }
}

function containsIllegalInput(x) {
  //console.log(x);
  return (!x);
}

 //sets a time in which the db was last updated. If Time of get-query before put-query is younger than this date => throw error
//
module.exports = 
{
    fetchAll: function(req, res) {
        //console.log("### QUERY GET: fetchAll startet...");
        let base_query = 'SELECT * FROM customer WHERE';
        let fullString = getFullString(base_query, req.query);

        connection.query(fullString, function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.send(error);
              }
              else
              {
                //console.log(assignment1_rest.dataVersion);
                res.cookie("dataVersion", assignment1_rest.dataVersion);
                res.statusCode = 200;
                res.send(results);
              }
        });
      },
      fetchCustomerTypes: function(req,res) {
        let base_query = 'SELECT * FROM customer WHERE';
        let qString = "SELECT * FROM customer_types WHERE 1;";
        connection.query(qString, function(error, results, fields){
            if ( error ){
                console.log("Error fetching data from db, reason: " + error);
                res.send(error);
              }
              else
              {
                //console.log("Data = " + JSON.stringify(results));
                res.statusCode = 200;
                res.send(results);
              }
        });
    },
    fetchSelectionData: function(req,res) {
        let query = "SELECT * FROM customer;";
        connection.query(query, function(error, results, fields) {
          if(error) {;
            res.statusCode = 418; //teapot
            res.send(error);
          } else {
            res.statusCode = 200;
            res.send(results);
          }
        });
    },
    updateCustomerData: function(req,results) {
      //console.log("updating customer data...");
      //console.log(req.params.id);
      //console.log(req.body);
      console.log("Checking if cookies.dataVersion is up-to-date: v" + req.cookies.dataVersion);

      if(req.cookies.dataVersion == assignment1_rest.dataVersion) {
          let sqlUpdateString= `UPDATE customer SET Name=?, Phone_Number=?, Address=?, Postal_Code=?, City=?, Customer_Type=? WHERE ID = ${req.params.id}`;
          let escapeArray = [req.body.Name, req.body.Phone_Number, req.body.Address, req.body.Postal_Code, req.body.City, Number(req.body.Customer_Type)];
          //console.log(sqlUpdateString);
          
          if(escapeArray.some(containsIllegalInput) === false)
          {
            //input is good
            connection.query(sqlUpdateString, escapeArray, function(err,result,fields) {
              if(err) {
                //console.log(fields);
                console.log("Error in Update-SQL-Query: " + err);
                results.statusCode = 400;
                results.send(err);
              } else {
                assignment1_rest.dataVersion++;
                results.cookie("dataVersion", assignment1_rest);
                results.statusCode = 204;
                results.send();
              }
            });
          } else {
            //input is bad
            results.statusCode = 420;
            let err = new Error('Not all fields were entered!!!');
            console.log(err);
            results.send("ERROR: ### ILLEGAL INPUT ###");
        }
      } else {
        results.statusCode = 421;  
        let err = new Error('Dataversion might have changed. Please refresh Search results beforehand updating!');
        console.log(err);
        results.send("ERROR: # Aged Dataversion can not be updated.");
      }
    },
    getCustomer: function(req,res) {
      //console.log(">> GET Customer info for CustID: "+ req.params.id);
      let getSQLString = `SELECT customer.ID, customer.Name, customer.Phone_Number, customer.Address, customer.Postal_Code, customer.City, customer.Customer_Type, customer_types.Legend FROM customer INNER JOIN customer_types WHERE ID = ${req.params.id} AND customer.Customer_Type = customer_types.TypeID ;`;
      //SELECT * FROM `customer` INNER JOIN customer_types WHERE customer.ID = 1 AND customer.Customer_Type = customer_types.TypeID;
      //console.log("> " + getSQLString);
      connection.query(getSQLString, function(err,result,fields) {
        if(err) {
          console.log("Error in SQL-query + " + err);
          res.send(err);
        } else {
          res.statusCode = 200; //everything's fine
          res.send(result);
        }
      });
    },
    deleteCustomer: function(req, res) {
      console.log("------------------\nDELETE CUSTOMER\n");
      console.log("Req-Query: "+JSON.stringify(req.query));
      console.log("Req-params: " + JSON.stringify(req.params));
      console.log("Req-body: " + JSON.stringify(req.body));
      console.log(req.params.id);

      
      let cID = req.params.id;
      let sqlDelete = "DELETE FROM customer WHERE ID = " + cID + ";";
      console.log("Now starting delete of customer nr. "+ cID);
      connection.query(sqlDelete, function(error, results, fields){
        if ( error ){
            console.log("Error deleting data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            //console.log("Data = " + JSON.stringify(results));
            res.statusCode = 204; //no content as response.
            res.send();
          }
    });
    },
    createCustomer: function(req,res) {
      console.log("------------------");
      console.log("CREATE CUSTOMER!");
      console.log("Req-Query: "+JSON.stringify(req.query));
      console.log("Req-params: " + JSON.stringify(req.params));
      console.log("Req-body: " + JSON.stringify(req.body));

      res.send("CREATE POST");
    },
    create: function(req, res){
        //console.log("------------------");
        //console.log("CREATE");
  
          //console.log("body : " + JSON.stringify(req.body));
          let c = req.body;
  
          connection.query('INSERT INTO  customer VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
            function(error, results, fields){
            if ( error ){
              console.log("Error when inserting data to db, reason: " + error);
              res.json(error);
            }
            else
            {
              //console.log("Data = " + JSON.stringify(results));
              res.statusCode = 201;
              c.Avain = results.insertId;
              res.json(c);
            }
        });
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


