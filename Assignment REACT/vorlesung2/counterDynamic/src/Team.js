import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { watchFile } from 'fs';
import './index.css';
import { createBrowserHistory } from 'history';

//const history = createBrowserHistory();


class Team extends React.Component
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
        if (this.state.showTeams) {
            console.log("teamdata: ",this.state);
            let newUrl = '/teams/' + this.props.data.ShortName
            let redirectObj = {
                pathname: newUrl,
                state: this.props.data.TeamName
            }
            //history.push('/teams/'+ this.props.data.ShortName, {teamSelected: this.props.ShortName});
            return (<Redirect to={redirectObj}/>)
        }else {
            
            return(<tr className="leagueTableIndividual_tr"onClick={()=>this.showTeam(this.props.ShortName)}><td style={{textAlign:"Left", color:"black"}}>{this.props.index}</td><td><img src={this.props.data.TeamIconUrl} width='25'></img></td><td style={{textAlign:"Left"}}>{this.props.data.TeamName}</td><td>{this.props.data.Matches}</td><td>{this.props.data.Won}</td><td>{this.props.data.Draw}</td>
                    <td>{this.props.data.Lost}</td><td>{this.props.data.Goals}</td><td>{this.props.data.OpponentGoals}</td><td>{this.props.data.GoalDiff}</td><td>{this.props.data.Points}</td></tr>)
        }
        
    }

}



export {Team};