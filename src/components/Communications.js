import React from 'react';
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'

export default class Communications extends React.Component {
    componentDidMount() {
        gigyaHelper.showScreens([
            {
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.communications.id,
                containerID: 'communication'
            }
        ])
    }
    render() {
        return (
              <div>
                <h2>Communications &amp; Alerts</h2>
                <div id='communication' className='subprofile' />
              </div>
            )
        }
}