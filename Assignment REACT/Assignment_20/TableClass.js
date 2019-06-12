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
            filteraddress:'',
            filtercustomertype:'0',
            loading : false,
            customertypes : [],
            custtypedropdown: (<select onChange={this.handleChangefiltercustomertype}><option value="">Still loading...</option></select>)
                
            ,
            isPreFetching: true
        }

        this.handleChangefiltername = this.handleChangefiltername.bind(this);
        this.handleChangefilteraddress = this.handleChangefilteraddress.bind(this);
        this.handleChangefilterage = this.handleChangefilterage.bind(this);
        this.handleChangefiltercustomertype = this.handleChangefiltercustomertype.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonFetchFiltered = this.buttonFetchFiltered.bind(this);
        this.renderCustomertypes = this.renderCustomertypes.bind(this);
        
    }

    
    async componentDidMount() {
        this.setState({isPreFetching:true}, async () => {
            await this.optionsForCustomerTypes();
        });
        // her comes the prefetching for customer types
        /*let temp = await fetch("http://localhost:3000/customertype");
        let data = await temp.json();
        console.log(data);
        
        this.setState({customertypes: data});*/

        
    }
    createTable(data) {
        //first of all: checking for empty input data.
        if(data.length == 0) {
            this.setState({table: (<p style={{paddingLeft:"10%",paddingTop:'75px'}}>#######NO INPUT######</p>)});
        } else {
            let tHeader = this.createHeader(data);
            let tBody = []; //forEach element => createRow(data).push
            data.forEach(element => {
                tBody.push(this.createRow(element));            
            });
            this.setState({table: (<table>
                <thead>{tHeader}</thead>
                <tbody>{tBody}</tbody>
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
        rowEle.push(<td><button key={singleDataset[singleDataset.name]} name={'deleteId' + singleDataset} onClick={() => { this.deleteDataset(singleDataset)}}>delete</button></td>);
        rowEle.push(<td><button>update</button></td>);
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
        
        if(this.state.filtername === '' && this.state.filterage === '' && this.state.filteraddress === '' && this.state.filtercustomertype === '0') {
            console.log(this.state.filtercustomertype);
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
         if(this.state.filtercustomertype !== '0') {
            baseUrl = baseUrl.concat(('customertype='.concat(this.state.filtercustomertype).concat('&').replace(" ", "%20")));
        }
        console.log(baseUrl);
        return baseUrl;
        }
    }
    
    buttonFetchFiltered() {
        //making use of callback function in setState! -- 
        this.setState({loading: true}, async() => {            
            
            let url1 = this.getConditionedUrl();
            
            let data = await fetch(url1);
            //let data_customertype = await fetch("http://localhost:3000/customertype");
            
            let customers = await data.json();
            
            //sets relevant data.
            this.setState({loading: false,data : customers});
            // 
            // creates table based on data (from state)
            this.createTable(this.state.data); //sets table-state with fetched data
        //
        console.log("DROPDOWN",this.state.custtypedropdown);
        console.log("TABLE", this.state.table);
        });
    }

    handleDelete(event) {
        event.preventDefault();

    }

    deleteDataset(dataset) {
        // implement logic for deletion...
        console.log("want to delete",dataset);

        this.setState({loading:true}, async() => {
            let baseUrl = "http://localhost:3000/customer/" + dataset.id;
            console.log(baseUrl);

            let rspns = await fetch(baseUrl, {
                method:'DELETE'
            });

            let jsonRes = await rspns.json();
            console.log("RESPONSE: ", jsonRes);

            let data = await fetch("http://localhost:3000/customer/");
            let customers = await data.json();

            this.setState({loading: false,data : customers});
            
            // 
            // creates table based on data (from state)
            this.createTable(this.state.data); //sets table-state with fetched data

        });
        //make REST API CALL
    }      

    renderCustomertypes(data) {
            console.log("rendering Customertypes");
            let cust = data;
            let options = []
            let count = 1;
            options.push(<option value="0" selected>Choose...</option>)
            cust.forEach(element => {
                console.log(element);
                options.push(<option value={element.customerid}>{element.typename}</option>)
                count++;
            });
            console.log(options);
            //<option value="1">{this.state.customertypes.typename[0]}</option>
            //<option value="2">b</option>
            return (<select onChange={this.handleChangefiltercustomertype}>{options}</select>);
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
    handleChangefiltercustomertype(event) {
        this.setState({filtercustomertype: event.target.value}); 
    }
    handleSubmit(event) {
        event.preventDefault();
        //console.log(this.state);
        //alert('Age = ' + this.state.filterage + '\n' + 'Name = ' + this.state.filtername);        
    }

    async optionsForCustomerTypes() {
        let temp = await fetch("http://localhost:3000/customertype");
        let data = await temp.json();
        console.log("customertypes rendered and now setState...");

        this.setState({customertypes: data});

        let optionComponent = await this.renderCustomertypes(data);

        this.setState({isPreFetching:false,custtypedropdown : optionComponent});
    }

    render() {

        //let fetchedData = this.inputNotEmpty(this.state.data);
        const LoadingIndicator = () => (
            <div style={{paddingLeft: '222px', paddingTop: '75px'}}>
              <i className="fa fa-spinner fa-spin" marginLeft="22px"/> Loading...
            </div>
          );
        
        const ResultTable = () => (
            this.state.table
        );

        const StillLoadingDropdown = () => (
            (<select>
                <option value="">Still loading...</option>
            </select>)
        );



        return(
            <div> 
                Filter:
            <table id="td1" style={{textAlign:'center', border: '1px solid black', paddingTop:'0px', marginBottom:'10px', paddingBottom:'10px'}}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Age</th>
                            <th>Customer Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input id="name" type="text"  value={this.state.filtername} onChange={this.handleChangefiltername}></input>
                            </td>
                            <td><input id="address" type="text" onChange={this.handleChangefilteraddress} value={this.state.filteraddress}></input></td>
                            <td><input id="age" type="text" onChange={this.handleChangefilterage} value={this.state.filterage}></input></td>
                            <td>
                                {this.state.isPreFetching ? this.state.custtypedropdown : this.state.custtypedropdown}
                                
                        </td>
                        </tr>
                    </tbody>
            </table>
                    
            <button onClick={this.buttonFetchFiltered} style={{width: '250px', height:'30px'}}>Get Data</button>
                    
                        {this.state.loading ? <LoadingIndicator/> : this.state.table}
                       
                <br></br>
                <br></br>
                
                </div>
        );
    }
}

export {TableClass};