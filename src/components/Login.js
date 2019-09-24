import React from 'react';
import constants from '../utils/constants'
import gigyaHelper from '../utils/gigya'

export default class Login extends React.Component {
    componentDidMount() {
        gigyaHelper.showScreens([
            {
                screenSet: constants.screensSets.loginReg.id,
                startScreen: constants.screensSets.loginReg.screens.login.id,
                containerID: 'login'
            }
        ])
    }
    render () {
        return (
          <div>
            <h1>Login / Register</h1>
            <div className="container">
                <div id='login' className='subprofile' />
            </div>
          </div>
        )
    }
}