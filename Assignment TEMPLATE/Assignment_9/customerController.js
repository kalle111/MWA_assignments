'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root', //Only for local use without official credentials.
  password : '',
  database : 'football'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = 
{
    fetchTypes : function()
    {
        return new Promise((resolve, reject) => {

          let query = "SELECT * FROM player";
          console.log("query : " + query );
          
          connection.query(query, function(error, results, fields){
            if ( error ){
              console.log("Error when fetching data, reason: " + error);
              reject("Error when fetching data, reason: " + error);
            }
            else
            {
              console.log("Rawdata = ", results);
              console.log("JSON Data = "+ JSON.stringify(results));
              resolve(results);
            }    
        })
      })
    },
    fetchNextEvents : function() 
    {
      return new Promise((resolve, reject) => {
        let sqlQuery = "SELECT * from next_events WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching League Table. err: " + error);
            reject("Error appeard when fetching league Table. " + error);
          } 
          else 
          {
            results.forEach(function(val) {
              let stringDt = val.Datum.toString();
              let dtArray = stringDt.split(" ");
              val.Datum = dtArray[3] + "-" + dtArray[1] + "-" + dtArray[2];
              //let datePartitions = new Date(val.Datum.getYear(), val.Datum.getMonth(), val.Datum.getDay());
              //val.Datum = 

              //console.log("Key: " + val.EventID + ", Datum: " + val.Datum, ", split: " + dt);

            })
            console.log(" Rawdata: ", results);
            console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    },
    fetchSelectOptions : function() 
    {
      return new Promise((resolve, reject) => {
        let sqlQuery = "SELECT * from selectOptions WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching League Table. err: " + error);
            reject("Error appeard when fetching league Table. " + error);
          } 
          else 
          {
            console.log(" Rawdata: ", results);
            console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    }
}
