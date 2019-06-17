import React, { useState, useEffect } from 'react';
import resultFetching from './resultFetching';

function SearchForm1 {

    const[filters, setFilters] = useState([{}])

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeNameFilter = this.handleChangeNameFilter.bind(this);
        this.handleChangeAddressFilter = this.handleChangeAddressFilter.bind(this);
        this.handleChangeAgeFilter = this.handleChangeAgeFilter.bind(this);
    

    handleChangeNameFilter(event) {
        this.setState({filterNameValue: event.target.value});
    }
    handleChangeAddressFilter(event) {
        this.setState({filterAddressValue: event.target.value});
    }
    handleChangeAgeFilter(event) {
        this.setState({filterAgeValue: event.target.value});
    }


    handleSubmit(event) {
        event.preventDefault();
        console.log('clicked submit');
        console.log('Name: ' + this.state.filterNameValue + ", Address: " + this.state.filterAddressValue + ", Age: " + this.state.filterAgeValue);
    }



    render() {
        return(
        <div>
            <form id='filterForm' onSubmit={this.handleSubmit}>
                <table>
                    <tbody>
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filtername'>Name: </label>
                            <input id='filtername' name='filtername' type='text' value={this.state.filterNameValue} onChange={this.handleChangeNameFilter}/>
                        </tr >
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filteraddress'>Address: </label>
                            <input id='filteraddress' name='filteraddress' type='text' value={this.state.filterAddressValue} onChange={this.handleChangeAddressFilter}/>
                        </tr>
                        <tr style={{textAlign:'right'}}>
                            <label htmlFor='filterage'>Age: </label>
                            <input id='filteage' name='filteage' type='text' value={this.state.filterAgeValue} onChange={this.handleChangeAgeFilter}/>
                        </tr>   
                        <tr>
                            <input id='submitFilter' type='submit' value='Find' style={{width:'100%'}}/>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>)
    }
}

export {SearchForm1}