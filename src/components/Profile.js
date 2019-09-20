import React from 'react';
import SubProfile from './SubProfile'

export default class Profile extends React.Component {
    constructor (props) {
        super(props);
        
    }
    
    render() {
        return (
            <div id="profile">
                {
                    this.props.screens.map((screen) =>
                        <SubProfile key={screen} screen={screen} />
                    )
                }    
                 
            </div>
        )
    }
}