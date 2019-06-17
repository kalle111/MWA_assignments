import React, { useState, useEffect } from 'react';
import resultFetching from './resultFetching';
import OutputTable from './OutputTable';

function SearchForm()
{
  //Loading symbol
    const LoadingIndicator = () => (
        <div style={{paddingLeft: '222px', paddingTop: '75px'}}>
          <i className="fa fa-spinner fa-spin" marginLeft="22px"/> Loading...
        </div>
      );

  const [filterName, setFilterName] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [output, setOutput] = useState(LoadingIndicator); //used for html output to be renderd + as Loading symbol while fetching.
  const [reload, setReload] = useState(true); // will always jump from true to false ...
  const [customerTypes, setCustomerTypes] = useState('');
  const [filterCustomerType, setFilterCustomerType] = useState('0');
  const [typesFetched, setTypesFetched] = useState(false);

  function generateTable(data) {
    let noData = 'noData'
    let tableHead = [];
    for(var k in data[0]) {
        //jedes element
        tableHead.push(<th>{k}</th>);
    }

    if(data.length === 0) {
        return <div><b>{noData}</b></div>
    } else {
    return(
        <table>
            <thead>
                {tableHead}
            </thead>
            <tbody>
                {data.map((item) =>  {
                    return <tr><td>{item.id}</td><td>{item.name}</td><td>{item.address}</td><td>{item.phone_number}</td><td>{item.age}</td><td>{item.education}</td><td>{item.customertype}</td><td><button onClick={()=>deleteUser(item.id)}>delete user</button></td></tr>
                })}
            </tbody>
        </table>
        )
        }
  } 

  async function deleteUser(id) {
    setOutput(LoadingIndicator);
    let baseUrl = "http://localhost:3000/customer/" + id;
    let rspns = await fetch(baseUrl, {
        method:'DELETE'
    });
    let jsonRes = await rspns.json();
    setReload(!reload); // triggers fetching after deletion
  }

  function getConditionedUrl() {
    let baseUrl = "http://localhost:3000/customer?";

    if(filterName === '' && filterAge === '' && filterAddress === '' && customerTypes === '0') {
        return baseUrl;
    } else {
     if ( filterAge !== '') {
        baseUrl = baseUrl.concat('age='.concat(filterAge).concat('&').replace(" ", "%20"));
    } 
     if (filterAddress !== '') {
         baseUrl = baseUrl.concat('address='.concat(filterAddress).concat('&').replace(" ", "%20"));
     }
     if(filterName !== '') {
         baseUrl = baseUrl.concat(('name='.concat(filterName).concat('&').replace(" ", "%20")));
     }
     if(filterCustomerType !== '0') {
        baseUrl = baseUrl.concat(('customertype='.concat(filterCustomerType).concat('&').replace(" ", "%20")));
     }
    }
    return baseUrl;
  }



  //----------------------------------------

  useEffect(() => {
    //this will be done whenever the second argument changes. 
    setOutput(LoadingIndicator)
    //output will be overwritten when async call is finished.
    async function fetchOutput() {
        let url = getConditionedUrl();
        let data = await fetch(url);
        let dataJson = await data.json();
        setOutput(generateTable(dataJson));

        if(typesFetched === false) {
           let customerTypeData = await fetch("http://localhost:3000/customertype");
           let jsonCustomerTypeData = await customerTypeData.json();
           setCustomerTypes(jsonCustomerTypeData);
           setTypesFetched(true);
        }
    }
    fetchOutput();
  }, [filterName, filterAddress, filterAge, reload, filterCustomerType, customerTypes]);

  return (
    <div name='info'>

      <p>You want to filter the following criteria: </p>
      <p>{ filterName ? ' Name: ' + filterName : ''} </p>
      <p>{ filterAge ? ' Age: ' + filterAge : ''} </p>
      <p>{ filterAddress ? ' Address: ' + filterAddress : ''}</p>
      <p>{ filterCustomerType ? ' CustomerType: ' + filterCustomerType : ''}</p>
      <b>------------------------------------------------------------------------</b>

      <div name='input'>
            <form id='filterForm' target='_self'>
                <table>
                    <tbody>
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filtername'>Name: </label>
                            <input id='filtername' name='filtername' type='text' value={filterName} onChange={event => setFilterName(event.target.value) /* <<== trimmed as it is not alloweed to start with a space*/}/>
                        </tr >
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filteraddress'>Address: </label>
                            <input id='filteraddress' name='filteraddress' type='text' value={filterAddress} onChange={(event) => setFilterAddress(event.target.value)}/>
                        </tr>
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filterage'>Age: </label>
                            <input id='filteage' name='filteage' type='text' value={filterAge} onChange={(event) => setFilterAge(event.target.value)}/>
                        </tr>   
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filterCustomerType'>CustomerType: </label>
                            <select onChange={(event) => setFilterCustomerType(event.target.value)}>
                                {!typesFetched ? <option value="">...loading...</option> :
                                    customerTypes.map(function(item, index) {
                                    return <option value={item.customerid}>{item.typename}</option>
                                })}
                            </select>
                        </tr>  
                        <tr>
                             <button id='submitFilter' type='button'  style={{width:'100%'}} onClick={() => ''}>Filter</button>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div name='output'>
            <b>------------------------------------------------------------------------</b>
            <br></br>
            Output:
            <div>{output}</div>
            

        </div>
    </div>
      );
}
export { SearchForm };