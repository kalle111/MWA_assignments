import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { watchFile } from 'fs';
import './index.css';
import { createBrowserHistory } from 'history';

//const history = createBrowserHistory();


class OutputTable extends React.Component
{

    constructor(props)
    {
        super(props);

        
        this.state = {
            teamData: [],
            showTeams: false
        }
    }
    async showTeam(name) {
        console.log('setting state');
        let newUrl = '/teams/'+name;
        await this.setState({
            showTeams : true
        });
        
        console.log('setting state', this.state);
        
        
        
    }


 
    render() {
        return (<table>1</table>)
        
    }

}



export default {OutputTable};