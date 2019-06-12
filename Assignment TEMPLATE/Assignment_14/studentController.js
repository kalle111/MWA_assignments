'use strict'

var mongoose = require('mongoose'),
Student = mongoose.model('Student');

module.exports = 
{
    fetchAll: function(req, res){
      console.log("HELLLLLLLLLLLLLLL");  
      let condition = {};
      /*
      console.log(req.query.name);
        if ( req.query.name != null ) 
          condition = {name : req.query.name};
        console.log("condition = ", condition);*/

        Student.find(function(err, cust) {
            if (err)
              res.send(err);

            res.json(cust);
          });
        
    },
    fetchAllNew: function(req,res) {
      return new Promise((resolve, reject) => {
        //console.log("query : " + query );
        console.log("Query: ");
        Student.find(function(err, cust) {
          if (err) {
            console.log(err);
            reject("error fetching data from mongoDB");
          } else {
            console.log(cust);
            resolve(cust);
          }
        });
      })  
    },
    fetchAllFiltered: function(req,res) {
      return new Promise((resolve, reject) => {
        //adjust logic
        //console.log("query : " + query );
        
        let numVar;
        let nameVar;
        let condition = [];
        let conditionObj = {}
        if(req.body.studentnumber != '' && req.body.studentnumber != 'undefinded') {
          conditionObj['studentnumber'] = req.body.studentnumber;
        }
        if(req.body.name != '' && req.body.name != 'undefined') {
          conditionObj['name'] = req.body.name;
        }

        Student.find( conditionObj ,function(err, cust) {
          if (err) {
            console.log(err);
            reject("error fetching data from mongoDB");
          } else {
            console.log(cust);
            resolve(cust);
          }
        });
      })  
    },
    createPrototypeStudent : function(req,res){
      return new Promise((resolve, reject)=> {
        console.log("########################\nReqBody:",req.body);
        var new_c = new Student(req.body);
  
        console.log(req.body);
        console.log("loggin new Student", new_c);
        new_c.save(function(err, student) {
          if (err) {
            reject(err);
          } 
            resolve();
          });
      })
    },

    create : function(req,res){
      var new_c = new Student(req.body);
      console.log(new_c);
      new_c.save(function(err, student) {
        if (err)
          res.send(err);
        
        res.statusCode = 201;
        res.json(new_c);
      });
    },

    update: function(req, res){
        Customer.findOneAndUpdate({_id: req.params.studentid}, req.body, {new: true}, function(err, student) {
            if (err)
              res.send(err);

            res.statusCode = 204;
            res.send();
          });
        
    },
    delete: function(req, res){
      Student.deleteOne({
            _id: req.params.studentid
          }, function(err, cust) {
            if (err)
              res.send(err);
            res.json({ message: 'Student successfully deleted' });
            res.statusCode = 204;
            res.send();
          });
    }
}
