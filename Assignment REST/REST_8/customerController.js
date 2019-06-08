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
function containsIllegalInput(x) {
  //console.log(x);
  return (!x);
}

function getFullString(preparedStatement,queryObj) {
  let whereSelection = "";
  let andCounter = 0;

  if((queryObj.id =="") && (queryObj.name == "") && (queryObj.address == "") && (queryObj.customer_type == 0)) {
    //console.log("##############################");
    return (preparedStatement + "1");
  } else {
      //console.log("Sufficient filters!!!!!!!!")
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
          //testPrint(attrName, attrValue);
          break;
        case "name":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Name = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;
        case "address":
            if(attrValue=="") {

              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Address = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;
        case "customer_type":
            if(attrValue==0) {
  
              whereSelection += " 1=1 ";
              continue;
            } else {
              whereSelection += " Customer_Type = " + connection.escape(queryObj[key]);
              andCounter++;
            }
            //testPrint(attrName, attrValue);
          break;  
      }
  }
  let result = (preparedStatement + whereSelection + ";");
  return (result);
  }
}


//
module.exports = 
{
    fetchAll: function(req, res) {
        //console.log("....in customerController/fetchAll");
        //console.log("### QUERY GET: fetchAll startet...");
        //console.log(req.query);
        res.cookie("dataVersion", assignment1_rest.dataVersion);
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
                //console.log("Data = " + JSON.stringify(results));
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
        //console.log("### PREFETCHING Cust_type combobox => " + qString);
        //console.log(qString);
        //let query = 'SELECT ID, Name, Phone_Number FROM customer WHERE ID=' + req.query.id;
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
        /*
        implement logic for dynamic Customer_types!!!!!
        a.) write window.onload()-function in main.html
          a.a.) create basic onload-function => ajax-call
          a.b.) write 
        */
    },
    fetchSelectionData: function(req,res) {
        //res.setHeader('Content-Type', 'json');
        //console.log("GET-query" + req.query);
        let query = "SELECT * FROM customer;";
        //console.log("Pre-Fetch: " + query);
        connection.query(query, function(error, results, fields) {
          if(error) {
            //console.log("SElection-Filter Get-Query is not working!" + erroor);
            res.statusCode = 418; //teapot
            res.send(error);
          } else {
            //console.log("Pre-fetched-Selection-data => " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results);
          }
        });
    },
    deleteCustomer: function(req, res) {
      console.log("------------------\nDELETE CUSTOMER\n");
      /*console.log("Req-Query: "+JSON.stringify(req.query));
      console.log("Req-params: " + JSON.stringify(req.params));
      console.log("Req-body: " + JSON.stringify(req.body));
      console.log("Res: " + JSON.stringify(res.locals));*/
      //console.log(req.params.id);

      
      let cID = req.params.id;
      let sqlDelete = "DELETE FROM customer WHERE ID = " + cID + ";";
      //console.log("Now starting delete of customer nr. "+ cID);
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
    createCustomer: function(req, res){
      //console.log("------------------");
      //console.log("CREATE Customer");
      //console.log("body : " + JSON.stringify(req.body));

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
          //console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          c.Name = results.Name;
          res.json(c);
        }
      })
    },
    create: function(req, res){
        //console.log("------------------");
        //console.log("CREATE");
  
          console.log("body : " + JSON.stringify(req.body));
          let c = req.body;
  
          connection.query('INSERT INTO  customer VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
            function(error, results, fields){
            if ( error ){
              console.log("Error when inserting data to db, reason: " + error);
              
              res.json(error);
            }
            else
            {
              console.log("Data = " + JSON.stringify(results));
              res.statusCode = 201;
              c.Avain = results.insertId;
              res.json(c);
            }
        });
      },
      updateCustomerData: function(req,results) {
        //console.log("Checking if cookies.dataVersion is up-to-date: v" + req.cookies.dataVersion);
        
        //check if shown Data-Version is equal to Server-Side Dataversion...
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
      getCustomerForDelete: function(req,res, next) {
        console.log('getting cust for deletion');
        //console.log(">> GET Customer info for CustID: "+ req.params.id);
        let getSQLString = `SELECT customer.ID, customer.Name, customer.Phone_Number, customer.Address, customer.Postal_Code, customer.City, customer.Customer_Type, customer_types.Legend FROM customer INNER JOIN customer_types WHERE ID = ${req.params.id} AND customer.Customer_Type = customer_types.TypeID ;`;
        //SELECT * FROM `customer` INNER JOIN customer_types WHERE customer.ID = 1 AND customer.Customer_Type = customer_types.TypeID;
        //console.log("> " + getSQLString);
        connection.query(getSQLString, function(err,result,fields) {
          if(err) {
            console.log("Error in SQL-query + " + err);
            res.statusCode = 400;
            res.send(err);
          } else {
            req.params.customerData = result;
            res.locals.customerData = result;
            console.log("result in getcustinfo");
            console.log(result);
            next();
          }
        });
      },
    addPhoneToBlocked: function(req,res, next){
        console.log("adding phone number...customerdata:");
        console.log(res.locals.ID);
        
        //Date Object manipulation
        function twoDigits(d) {
          if(0 <= d && d < 10) return "0" + d.toString();
          if(-10 < d && d < 0) return "-0" + (-1*d).toString();
          return d.toString();
        }
        Date.prototype.toMySQLFormat = function() {
          return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate());
        }
        
        var myDate = new Date();
        /*myDate = myDate.setMonth(myDate.getMonth() + 6);
        myDate = myDate.toMySQLFormat;*/
        let futureUnix = new Date(myDate.setMonth(myDate.getMonth() + 6)).toMySQLFormat();
        console.log("myDate: " + futureUnix);
        let addBlockedNumberSQL =  `INSERT INTO blocked_phone_numbers (Phone_Number, Previous_Owner, Free_to_be_used) VALUES(${req.params.customerData[0].Phone_Number},"${req.params.customerData[0].Name}","${futureUnix}");`
        console.log(addBlockedNumberSQL);
        connection.query(addBlockedNumberSQL, (err, result, fields) => {
          if(err) {
            console.log("Error in SQL-query + " + err);
            res.statusCode = 400;
            res.send(err);
          } else {
            console.log(result);
            next();
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


