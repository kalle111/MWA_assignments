import React from 'react';

class SimpleData extends React.Component
{
    constructor(props)
    {
        super();

        this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state =
        {
            age: "",
            name : 'Markus'
        }
    }

    buttonOnclicked()
    {
        //alert('Message from X')
        if(this.state.name === 'Matt') {
            this.setState({name:'Marc'});
        } else {
            this.setState({name:'Matt'});
        }
        
    }

    buttonOnAgeclicked()
    {
        this.setState({age: 22});
    }

    onNameChanged(event)
    {
        this.setState({name : event.target.value});
    }

    render()
    {
        let address = this.props.address;

        return(
            <div>
                <p style={{color:"red"}}>My name is {this.state.name} and my address is {address}</p>
                <p>My age is {this.state.age}</p>
                
                <input type="text" onChange={(event) => this.onNameChanged(event)}/>
                
                <button onClick={this.buttonOnclicked}>Update name</button>
                <button onClick={() => this.buttonOnAgeclicked()}>Update age</button>

            </div>
        );
    }
}

export {SimpleData};