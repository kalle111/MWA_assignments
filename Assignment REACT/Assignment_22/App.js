import React from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
import {BrowserRouter, Route, NavLink, Switch} from 'react-router-dom';
import { TableClass } from './TableClass';
import {LeagueTable} from './LeagueTable';
import {Teams} from './Teams';
import {News} from './News';

function App() {
  return (
    
      <div class="wrapper1">
        <BrowserRouter basename="/">
        <div class="box head">
          <div class="menuDiv">
              <table className="header_table">
                <td className="header_table_td"><NavLink class="menutable" exact to="/home">HOME</NavLink></td>
                <td className="header_table_td"><NavLink class="menutable" to="/table">LEAGUE TABLE</NavLink></td>
                <td className="header_table_td"><NavLink class="menutable" to="/teams">TEAMS</NavLink></td>
              </table>
          </div>
        </div>
        <div class="box body bodymiddle">
        
        <br />

          <Switch>
            <Route exact path="/" component={News} />
            <Route exact path="/home" component={News} />
            
            <Route exact path="/table" component={LeagueTable} />
            <Route exact path="/teams" component={Teams} />
            
            <Route exact path="/teams/:name" component={Teams} />
            <Route component={pageNotFound} />
          </Switch>
          
          
          
        </div>
        <div class="box bottom">
          <h2>THIS FOOTER........................................................................................................................................................................................................</h2>
        </div>
      
          
        </BrowserRouter>
      </div> 
    
  );
}

function pageNotFound() {
  return (<p>404 Error - Page not found!</p>)
}
function RenderCustomerFetching(props)
{
  return(<TableClass/>)
}


function Third(props)
{
  return(
    <div>
      <h1>Show team statistics for: {props.match.params.name}</h1>
    </div>
  )
}


function Home()
{
  return(
    <div>
      <h1>domain/* => her comes the Entry-Page content.</h1>
    </div>
  )
}

function First()
{
  return(
    <div>
      <h1>This is first</h1>
    </div>
  )
}

function Second(props)
{
  return(
    <div>
      <h1>This is SECOND {props.name}</h1>
    </div>
  )
}

export default App;



/*import React from 'react';
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

export default App;*/
