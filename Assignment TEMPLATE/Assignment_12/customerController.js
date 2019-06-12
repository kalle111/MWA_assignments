'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');
var express_val = require('express-validator');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root', //Only for local use without official credentials.
  password : '',
  database : 'customers'
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
          //console.log("query : " + query );
          console.log("Query: ");
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
    fetchCustomerTypes: function() {
      return new Promise((resolve, reject) => {
        
        let sqlQuery = "SELECT * from customer_types WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching customer_types. err: " + error);
            reject("Error appeard when fetching customer_types. " + error);
          } 
          else 
          {
            //console.log(results);
            resolve(results);
          }
        })
      })
    },
    fetchFilteredCustomers: function(data) {
      return new Promise((resolve, reject) => {
        //console.log(data);
      if(data.name == '') {
        console.log("data empty");
      } 
        //condition builder
        function buildConditions(params) {
          console.log("Params: ", params);
          var conditions = [];
          var values = [];
          var conditionsStr;;
          
          if (!(typeof params.id != 'undefined') || !(params.id == '')) {
            conditions.push("ID = ?");
            values.push(parseInt(params.id));
          }
          if(params.name != '') {
            console.log('IS EMPTY');
            conditions.push("Name = ?");
            values.push(params.name);
          }
          if (params.address != '') {
            conditions.push("Address = ?");
            values.push(params.address);
          }
        
          if (params.customer_type != 0 || params.customer_type != "0") {
            console.log("CustType = ",params.customer_type);
            conditions.push("Customer_Type = ?");
            values.push(parseInt(params.customer_type));
          }
        
          return {
            where: conditions.length ? conditions.join(' AND ') : '1',
            values: values
          };
        }
        var conditions = buildConditions(data);
        console.log("conditions.values: ", conditions.values);
        console.log("condition.where", conditions.where);
        
        var sqlQuery = 'SELECT * FROM customer WHERE ' + conditions.where + ";";

        console.log(sqlQuery);
        //let sqlQuery = "SELECT customer.*, customer_types.* from customer RIGHT JOIN customer_types ON customer.Customer_Type = customer_types.TypeID WHERE 1;";

          connection.query(sqlQuery, conditions.values, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching customer_types. err: " + error);
            reject("Error appeard when fetching customer_types. " + error);
          } 
          else 
          {
            //console.log(results);
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
            console.log("Error when fetching next_events. err: " + error);
            reject("Error appeard when fetching next_events. " + error);
          } 
          else 
          {
            results.forEach(function(val) {
              let stringDt = val.Datum.toString();
              let dtArray = stringDt.split(" ");
              val.Datum = dtArray[3] + "-" + dtArray[1] + "-" + dtArray[2];
            })
            //console.log(" Rawdata: ", results);
            //console.log("JSON Data = " + JSON.stringify(results));
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
            console.log("Error when fetching Select options. err: " + error);
            reject("Error appeard when fetching select options Table. " + error);
          } 
          else 
          {
            //console.log(" Rawdata: ", results);
            //console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    },
    fetchLeagueTable : function (){
      return new Promise((resolve, reject) => {
        let sqlQuery = "SELECT league_table.*, team.* from league_table RIGHT JOIN team ON league_table.Id = team.Id  WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching League Table. err: " + error);
            reject("Error appeard when fetching league Table. " + error);
          } 
          else 
          {
            //console.log(" Rawdata: ", results);
            //console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    },
    fetchPlayerDetails : function() 
    {
      return new Promise((resolve, reject) => {
        //let sqlQuery = "SELECT player.*, team.*, player.Id AS Player_ID from player LEFT JOIN team ON player.Team_id = team.Id  WHERE 1;";
        let sqlQuery = "Select * from player WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching Select options. err: " + error);
            reject("Error appeard when fetching select options Table. " + error);
          } 
          else 
          {
            //console.log(" Rawdata: ", results[0]);
            //console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    },
    fetchTeamDetails : function() 
    {
      return new Promise((resolve, reject) => {
        //let sqlQuery = "SELECT player.*, team.*, player.Id AS Player_ID from player LEFT JOIN team ON player.Team_id = team.Id  WHERE 1;";
        let sqlQuery = "Select * from team WHERE 1;";

          connection.query(sqlQuery, function(error, results, fields) {
          if (error) {
            console.log("Error when fetching Select options. err: " + error);
            reject("Error appeard when fetching select options Table. " + error);
          } 
          else 
          {
            //console.log(" Rawdata: ", results[0]);
            //console.log("JSON Data = " + JSON.stringify(results));
            resolve(results);
          }
        })
      })
    }
}
