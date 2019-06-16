import React from 'react';
import Header from './Header';
//import {SimpleData} from './SimpleData';
//import {TableClass} from './TableClass';
import {CounterClass} from './CounterClass';

function randomSuffix() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 2; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createRandomPostal() {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 5; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {
  //data passed to TableCreator Class
  let tableDataObjects = [];
  let i = 0;
  for(i = 0; i<10; i++) {
    let dataObject1 = {
      name :("Marc____" +randomSuffix()),
      address:"Am Sand 1",
      postalcode:createRandomPostal(),
      city:"Regensburg"
    };
     tableDataObjects.push(dataObject1);
  }
  

  return (
    <div>
      <Header number="17" assignmentDesc="Insert two Buttons that Count + conditional styling"/>
      <CounterClass msg="hallo"/>
    </div>
  );
}

export default App;
