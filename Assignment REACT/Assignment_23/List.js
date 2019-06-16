import React from 'react'

class List extends React.Component
{
    constructor(props)
    {
        super();


        this.state =
        {
            data : [],
            name : null
        }
    }
    
    // Life cycle method
    componentDidMount()
    {
        // If you need to call REST after component has been initialized, do it here
        // DO NOT put any REST calls inside constructor OR render method
        console.log("In componentDidMount ...");
    }

    componentDidUpdate()
    {
        console.log("Render was probably called earlier ...");
    }

    async buttonOnClicked()
    {
        console.log("Button was clicked.");
        this.setState({name : "Marc Orel"});
        // install json-server package first (see specs from Google)

        // Use fetch (no need to install anything) OR use axios (must install axios)
        console.log("fetching data now...");
        let data = await fetch("http://localhost:3000/customer");

        console.log("data = ", data);

        let customers = await data.json();
        
        
        console.log("customer: ", customers);
        this.setState({data : customers});
    }

    render()
    {
       
        //let count = 0;
        //if ( this.state.data != null )
          const  count = this.state.data.length;

        return (
            <div>
                <p>Hello {this.state.name}</p>
                <p>There were {count} customers</p>
                <button onClick={() => this.buttonOnClicked()}>Call REST</button>
            </div>
        );
    }
}

export default List;
