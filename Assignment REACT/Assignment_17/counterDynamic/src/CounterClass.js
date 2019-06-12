import React from 'react';

class CounterClass extends React.Component {
    //constructor
    constructor(props)
    {
        super();
        this.deCreaseCounterClick = this.deCreaseCounterClick.bind(this);
        
        // state
        this.state =
        {
            counter: 0,
            counterStyle : {
                color: 'blue',
                fontSize: 30,
                fontWeight: 400
            }
        }
    }
    
    deCreaseCounterClick()
    {
        this.setState({counter: this.state.counter-1});
        
        if((this.state.counter-1) < 10) {
           this.setState({counterStyle : {
               color: 'blue',
               fontWeight: 400,
               fontSize: 30
           }});
        }
    }
    inCreaseCounterClick() 
    {
        this.setState({counter: this.state.counter+1});
        if((this.state.counter)+1 > 9) {
           this.setState({counterStyle : {
               color: 'red',
               fontWeight: 900,
               fontSize: 30
           }});
    }
    }

    render() {

        return(
            
            <div style={{marginLeft:50}}>
                <table id="counter">
                <tr style={{textAlign:"center", width:200}}><th>Counter: </th><th style={{textAlign:"center"}}>
                    <text style={this.state.counterStyle}>{this.state.counter}</text></th></tr>
                <tr style={{textAlign:"center"}}>
                    <td><button style={{width:100}} onClick={this.deCreaseCounterClick}>-</button></td>
                    <td><button style={{width:100}} onClick={() => this.inCreaseCounterClick()}>+</button></td>
                    
                </tr>
                </table>
            </div>
        );
    }
}      

export {CounterClass};