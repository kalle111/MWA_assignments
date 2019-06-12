import React from 'react';

class Header extends React.Component
{
    constructor(props)
    {
        super();     
    }

    render()
    {
        return(
            <div>
                <p>{this.props.name} {this.props.address} {this.props.endOfSentence}</p>
            </div>
        );
    }
}

export default Header;