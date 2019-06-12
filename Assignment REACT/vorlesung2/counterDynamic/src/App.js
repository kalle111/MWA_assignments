import React from 'react';
import './App.css';
import List from './List';
import {TableClass} from './TableClass';

function App() {
  return (
    <div>
      <p>JSON-server started with flag -d 3000 => 3 Second delay.</p>
      <br></br>
      
      <TableClass />      
    </div>
  );
}

const Counter = () => <p>Hello, I'm counter</p>;

function Header(props)
{
  return <div>
    <p>This is header {props.name}</p>
  </div>
}

export default App;
