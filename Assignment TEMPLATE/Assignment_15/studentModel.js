'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
  studentnumber: {
    type: String,
    required: 'studentnumber is mandatory'
  },
  name: {
    type: String,
    required: 'Name is mandatory'
  },
  yearstarted: {
    type: String,
    required: 'yearstarted is mandatory'
  },
  uniname: {
    type: String,
    required: 'uniname is mandatory'
  },
  degree: {
    type: String,
    required: 'degree is mandatory' 
  },
  courses: {
    type: Array,
    "default" : []
  }
  
});
/* testing
StudentSchema.query.byNumberOrName = function(inputdata) {
  let customFilterID, customFilterName; 
  if(inputdata.studentnumber != '') {
    customFilterID = inputdata.studentnumber;
  }
  if(inputdata.name != '') {
    customFilterName = inputdata.name;
  }

  return "";

}*/

module.exports = mongoose.model('Student', StudentSchema);