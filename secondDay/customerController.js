// npm install mysql --save
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // Note! Do not use root credentials in production!
  password : '',
  database : 'asiakas'
});
console.log("connection-ping: " + connection.state);
module.exports = 
{
    fetchAll: function(req, res){
      console.log("query (GET): ", req.query);

      let query = 'SELECT Avain, Nimi, Osoite, Postinro, Postitmp, Luontipvm, asty_avain FROM Asiakas';

      connection.query(query, function(error, results, fields){
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
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

    fetchOne: function(req, res){

      console.log("params (GET one): " + JSON.stringify(req.params));
      
      res.send(params);
    },

    create: function(req, res){
      console.log("------------------");
      console.log("CREATE");

        console.log("body : " + JSON.stringify(req.body));
        let c = req.body;

        connection.query('INSERT INTO Asiakas (Nimi, Osoite, Postinro, Postitmp, Luontipvm, Asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
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

    update: function(req, res){
      console.log("------------------");
      console.log("UPDATE");
      console.log("body: " + JSON.stringify(req.body));
      console.log("params: " + JSON.stringify(req.params));

      res.statusCode = 204;
      res.send();
  },

  delete : function (req, res) {
      console.log("------------------");
      console.log("DELETE");
      console.log("params: " + JSON.stringify(req.params));

      res.statusCode = 204; // No content
      res.send();
  }
}
