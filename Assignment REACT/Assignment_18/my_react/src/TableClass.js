import React from 'react';

class TableClass extends React.Component
{
    constructor(props)
    {
        super();

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state =
        {
            age: "",
            name : 'Markus'
        }
    }
    //returns one row at each time
    
    createRow(oneObject){
        return(<tr style={{textAlign:"center", color:"red"}}><td>{oneObject.name}</td><td>{oneObject.address}</td><td>{oneObject.postalcode}</td><td>{oneObject.city}</td></tr>);
    }
    render() {
        //variables
        let dataObject = this.props.dataObjectArray;
        let rows = [];
        
        dataObject.forEach(element => {
            rows.push(this.createRow(element));
        });
        console.log(rows[0]);
        
        return(
            <div>
                <table>
                    <tr>
                        <th>Name</th><th>Address</th><th>Postal Code</th><th>City</th>
                    </tr>
                        {rows}
                </table>
            </div>
        );
    }
}

export {TableClass};