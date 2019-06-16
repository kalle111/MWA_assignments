import React from 'react';
import { watchFile } from 'fs';
import './index.css';
import { Team } from './Team.js'
import { EventEmitter } from 'events';
import {NavLink} from 'react-router-dom';
import {Link} from 'react-router-dom';
class LeagueTable extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            data: [],
            isPreFetching:false,
            tableTable : null,
            tableHead: null,
            showTable: true
        }
        this.showTeamInfo = this.showTeamInfo.bind(this);
    }
    handleClickOnTeam(team){
        return "a";
    }
    async componentDidMount() {
        this.setState({isPreFetching:true}, async () => {
            await this.fetchLeagueTable();
        });       
    }
    async fetchLeagueTable() {
        //https://www.openligadb.de/api/getbltable/bl1/2018
        let temp = await fetch("http://localhost:3000/bundesligatable18");
        let data = await temp.json();
        console.log("customertypes rendered and now setState...");
        if(data.length > 0) {

        // sort table
        data.sort(function(a, b) {
            return parseFloat(b.Points) - parseFloat(a.Points);
        });

        //setState
        this.setState({data: data});
        
        //creates TableHeader based on this.state.data
        this.createTableHeader();
        //let optionComponent = await this.renderCustomertypes(data);
        this.setState({isPreFetching:false});

        //obsolescent after after <Table/> implementation
        //this.createTableDiv();
        } else {
            console.log("error fetching data.");
        }   
    }

    showTeamInfo(e) {
        console.log(e);
    }

    createTableHeader() {
        this.setState({ tableHead: (<tr><th>Place</th><th>Icon</th><th>Team</th><th># Games</th><th>W</th><th>T</th><th>L</th><th>GF</th><th>GA</th><th>GoalDiff</th><th>Points</th></tr>)})
    }
    createTableObject() {
        
        let tableStyle = {alignSelf:"center", alignItems:"center", alignContent:"center", alignmentBaseline:"center", paddingLeft:"5%", paddingRight:"5%"};
        //nur table von 
        return(
            <div style={tableStyle}>
                    <table className='leagueTableIndividual'style={tableStyle}>
                        <tbody>
                            {this.state.data ? this.state.tableHead : ''}
                            {this.state.data.map(function(item,index) {
                                return <Team data={item} index={(index+1)}/>
                            })}
                        </tbody>
                           
                    </table>
            </div>
        )
    }

    render() {

        return(
            <div>{this.state.showTable ? this.createTableObject() : "showTeamClicked" }</div>
        )
        
    }
}

export {LeagueTable};