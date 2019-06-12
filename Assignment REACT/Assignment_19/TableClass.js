import React from 'react';
import { watchFile } from 'fs';

class TableClass extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            data: [],
            name: null,
            table: null,
            rows: [],
            filtername : '',
            filterage : '',
            filteraddress:''
        }

        this.handleChangefiltername = this.handleChangefiltername.bind(this);
        this.handleChangefilteraddress = this.handleChangefilteraddress.bind(this);
        this.handleChangefilterage = this.handleChangefilterage.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonFetchFiltered = this.buttonFetchFiltered.bind(this);
    }

    createTable(data) {
        //first of all: checking for empty input data.
        if(data.length == 0) {
            this.setState({table: (<p>##NO INPUT##</p>)});
        } else {
            let tHeader = this.createHeader(data);
            let tBody = []; //forEach element => createRow(data).push
            data.forEach(element => {
                tBody.push(this.createRow(element));            
            });
            this.setState({table: (<table>
                {tHeader}
                {tBody}
            </table>)});
        }
    }
    createRow(singleDataset){
        let rowEle = [];
        //iterates through all dataset values and pushes it to array.
        for(var key in singleDataset) {
            rowEle.push(<td>{singleDataset[key]}</td>);
        }
        // Button iserted --> specify later
        rowEle.push(<button>delete</button>);
        rowEle.push(<button>update</button>);
        //
        //return in parentheses
        return(<tr>{rowEle}</tr>);
    }

    createHeader(oneObject){
        //implement logic to get header from data.
        let tableHead = [];
        for(var k in oneObject[0]) {
            //jedes element
            tableHead.push(<th>{k}</th>);
        }
        console.log(tableHead);
        return (<tr>{tableHead}</tr>)
    } 

    createNoinputRow() {
        return(<tr textAlign="center"><td colspan="5" textAlign="center" >
                        
        </td></tr>)
    }


    getConditionedUrl() {
        let baseUrl = "http://localhost:3000/customer?";

        if(this.state.filtername === '' && this.state.filterage === '' && this.state.filteraddress === '') {
            console.log('no filter input => put everything out there');
            return baseUrl;
        } else {
         if ( this.state.filterage !== '') {
            baseUrl = baseUrl.concat('age='.concat(this.state.filterage).concat('&').replace(" ", "%20"));
        } 
         if (this.state.filteraddress !== '') {
             baseUrl = baseUrl.concat('address='.concat(this.state.filteraddress).concat('&').replace(" ", "%20"));
         }
         if(this.state.filtername !== '') {
             baseUrl = baseUrl.concat(('name='.concat(this.state.filtername).concat('&').replace(" ", "%20")));
         }
        }
        
        return baseUrl;
    }
    async buttonFetchFiltered() {

        //let url = "http://localhost:3000/customer?";
        let url1 = this.getConditionedUrl();
        
        let data = await fetch(url1);
        

        
        let customers = await data.json();
        console.log("JSON: ", customers);
        
        //add search conditioning.
        
        
        //

        //sets relevant data.
        this.setState({data : customers});
        // 

        // creates table based on data (from state)
        this.createTable(this.state.data); //sets table-state with fetched data
        //
    }

    handleChangefiltername(event) {
        this.setState({filtername: event.target.value});
        
    }

    handleChangefilterage(event) {
        this.setState({filterage: event.target.value});
        
    }
    handleChangefilteraddress(event) {
        this.setState({filteraddress: event.target.value});
        
    }
    handleSubmit(event) {
        event.preventDefault();
        //console.log(this.state);
        //alert('Age = ' + this.state.filterage + '\n' + 'Name = ' + this.state.filtername);        
    }

    render() {

        //let fetchedData = this.inputNotEmpty(this.state.data);

        return(
            <div> 
                Filter:
            <table id="td1" style={{textAlign:'center', border: '1px solid black', paddingTop:'0px', marginBottom:'10px', paddingBottom:'10px'}}>
                    
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td><input id="name" type="text"  value={this.state.filtername} onChange={this.handleChangefiltername}></input></td>
                        <td><input id="address" type="text" onChange={this.handleChangefilteraddress} value={this.state.filteraddress}></input></td>
                        <td><input id="age" type="text" onChange={this.handleChangefilterage} value={this.state.filterage}></input></td>
                    </tr>
            </table>
                    
            <button onClick={this.buttonFetchFiltered} style={{width: '250px', height:'30px'}}>Get Data</button>
                    <table>
                        {this.state.table}
                    </table>    
                <br></br>
                <br></br>
                
                </div>
        );
    }
}

export {TableClass};