import React from 'react';

export default class SubProfile extends React.Component {
    constructor (props){
        super(props);
        
    }
    render() {
        
        return (
                <div id={this.props.screen} className="subprofile">
                {
                    //this isn't called after state change, still trying to figure out why. anything else put here re-renders after state change. forEach call in changeScreen() to account for this for now
                    gigya.accounts.showScreenSet({screenSet:'Default-RegistrationLogin', startScreen:this.props.screen, containerID: this.props.screen, onAfterScreenLoad: event => {console.log(this.props.screen)}})
                }
                
                    
                </div>
            )
        }
        
    
}