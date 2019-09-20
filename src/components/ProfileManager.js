import React from 'react';
import Navigation from './Navigation'
import Profile from './Profile'

export default class ProfileManager extends React.Component {
    constructor(props){
        super(props);
         this.changeScreen=this.changeScreen.bind(this);

         
         this.state = {
             screens: ['gigya-login-screen']
         }
    }

    
    changeScreen(screenNames){
        this.setState(() => ({screens: screenNames}))
        this.state.screens.forEach((screen) => {
            gigya.accounts.showScreenSet({screenSet:'Default-ProfileUpdate', startScreen: screen, containerID: screen})
        })
    }
    render () {
        return (
            <div className="container">
                <Navigation changeScreen={this.changeScreen} />
                <Profile screens={this.state.screens} />
            </div>
        )
    }   
}