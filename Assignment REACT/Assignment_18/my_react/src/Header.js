import React from 'react';

class Header extends React.Component
{
    constructor(props)
    {
        super();     
    }

    render()
    {
        let assignmentText = "Assignment Nr. ";
        return(
            <div>
                <p>{assignmentText}{this.props.number}:</p>
                <p>{this.props.assignmentDesc} </p>
                <p>{this.props.optionalInfo}</p>
                <p>------------------------------------------------</p>
            </div>
        );
    }
}

export default Header;