'use strict'

var mongoose = require('mongoose'),
Student = mongoose.model('Student');
var express = require('express');
var cons = require('consolidate');
var app = express();
var path = require('path');
var studentController = require('./studentController');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator()); //validate input and sanitize it. // important: after body-parser.
// Print all possible template engines
//console.log(cons);

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


module.exports = 
{
    getMainApp:  async function(req, res){
      
      var preFetchStudents = await studentController.fetchAllNew();
      console.log("Prefetch result: ",preFetchStudents);
      res.render('fetch', {
        title: "Assignment 14",
        subtitle: "Customer-Fetching",
        preFetchStudents : preFetchStudents,
        message:"message"
    });
    },
    getMainAppFiltered : async function(req,res){
      //render/redirect something
      var preFetchStudents = await studentController.fetchAllFiltered(req, res);
      console.log("Filtered Students result: ",preFetchStudents);
      res.render('fetch', {
        title: "Assignment 14",
        subtitle: "Customer-Fetching",
        preFetchStudents : preFetchStudents,
        message:"message"
    });
    },
    newStudent : async function(req,res){
      var response = await studentController.createPrototypeStudent(req, res);
      var preFetchStudents = await studentController.fetchAllNew(req,res);
      
      console.log("Prefetch result: ",preFetchStudents);
      res.render('fetch', {
        title: "Assignment 14",
        subtitle: "Customer-Fetching",
        preFetchStudents : preFetchStudents,
        message:"message"
    });
    }, //test purposes ###############
    newStudent1 : async function(req,res) {
      var response = await studentController.createPrototypeStudent(req, res);
      res.send();
    }
}
