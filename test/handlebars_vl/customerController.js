'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  database : 'asiakas'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = 
{
    fetchTypes : function()
    {
        return new Promise((resolve, reject) => {

          let query = "SELECT * FROM AsiakastyyppiX";
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
}
