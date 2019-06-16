import React from 'react';
import { watchFile } from 'fs';
import './index.css';

class Teams extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: [],
            playerData: [],
            filteredResults: [],
            isPreFetching: false,
            outputEle: null
        }
    }
     componentDidMount() {
        console.log("PROPS of TEAMS-page",this.props);
        this.setState({isPreFetching:true}, () => {
             this.fetchTeamStatistics();
        });   
    }

    async generateOutput() {
        console.log("State of Teams-Component: ", this.state.data);
    }
    async fetchTeamStatistics() {
        //https://www.openligadb.de/api/getbltable/bl1/2018
        let temp = await fetch("http://localhost:3000/bundesligastatistic18/");
        let data = await temp.json();
        console.log("Statistics prefetched.");
        if(data.length > 0) {
        //fetching 'error-handling'
        
            // sort table
            data.sort(function(a, b) {
                return parseFloat(b.Points) - parseFloat(a.Points);
            });
            console.log("TEAM DATA",data);
            let filteredData = [];
            let filteredPlayer = [];
            let filteredResults = [];
            for(var i = 0; i<data.length; i++) {
                
                if(data[i].TeamName === this.props.history.location.state) {
                    console.log("teamname hit! => ", data[i]);
                    filteredData.push(data[i]);
                    filteredPlayer.push(data[i].player);
                    filteredResults.push(data[i].results);
                }
            }
            //setState

            
            
            //creates TableHeader based on this.state.data

            //let optionComponent = await this.renderCustomertypes(data);
            this.setState({isPreFetching:false}, () => {
                this.setState({data: filteredData}, ()=>{
                    //do something.
                    this.setState({playerData: filteredPlayer}, () => {
                        this.setState({filteredResults: filteredResults});
                    });
                });
                
            });

            //obsolescent after after <Table/> implementation
            //this.createTableDiv();
            
 
        } else {
            console.log("error fetching data.");
        }   


    }

    generalInformationPage() {
            return (<div><i>Please select one of the teams from tab League table to see in-depth statistics for each team!</i>

                <p><h3>Bundesliga statistics:</h3></p>
                <ul>
                    <li>Goals per game: 2.33</li>
                    <li>Odds of a winning home-side: 57%</li>
                    <li>Average audience: 33.278 viers</li>
                    <li>Most goals in one game: FC Bayern - Hamburger SV (9-1)</li>
                    <li>Golden Boot winner: Robert Lewandowski (FC Bayern)</li>
                    <li>Golden Glove winner: Yann Sommer (Borussia Mönchengladbach</li>
                    <li>Aggregated budget spent on transfers: 561.100.000€</li>
                    <li>Aggregated budget received from transfers: 580.335.000€</li>
                </ul>
            </div>)
    }
    render() {
        let playerData = this.state.data.player;
        function pData() {
            console.log(playerData);
        }

        return(<div>
                {this.state.data.length <= 0 ? this.generalInformationPage() : 
                    <div className="dataDivTeamStats">
                        <div><table>
                    {this.state.isPreFetching ? "...Loading..." :  this.state.data.map(function(item,value) {
                        return <tr style={{textAlign:"center"}}><img src={item.TeamIconUrl} width='150' alt="none"></img></tr>
                    })}
                    </table>
                    <br></br>
                    Player Overview for {this.state.data.TeamName}: 
                    <ul>
                        {this.state.playerData.length <= 0 ? 'no data ' : this.state.playerData[0].map(function(item,value) {
                            return <li>Player Name: {item.name} is aged {item.age} and has scored {item.goals} goals and {item.assists} assists in {item.appearences} Matches.</li>
                        }
                        )}

                    </ul>
                    <b>Latest results: </b>
                    <ul>
                        {this.state.filteredResults.length <= 0 ? 'no data' : this.state.filteredResults[0].map(function(item, value) {
                            return <li>{item.place} against {item.opponent}, result: {item.fixture}</li>
                        })}

                    </ul>
                    </  div>
                    <i>Here would go all Players and Club statistics if I would have a sufficient database...:-)</i>
                    <br></br>
                    => ....
                    </div>
                    
                }
              </div>);
        
    }
}

export {Teams};